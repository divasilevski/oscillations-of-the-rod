class Methods {
	/** Shooting method || Collocation method
	 *
	 * @param {Function} func Function E(x): elastic distribution
	 * @param {Number} h Step
	 * @param {Number} kappa Value
	 * @param {Number} p Value
	 */
	constructor(func, h, kappa = 1, p = 1) {
		this.save_data = arguments;
		this.x;
		this.solution;
		this._create_solution(...this.save_data);
	}

	_create_solution(func, h, kappa, p) {}

	_value_index(x) {
		return this.x.findIndex(element => element == x);
	}

	frequencyResponse(a, b, h_kappa, h = this.save_data[1]) {
		// Create vector from kappa
		let kappa = LinearAlgebra.vector(a, b, h_kappa);

		// Find a solution for every kappa
		let freq = kappa.map(el => {
            this._create_solution(this.save_data[0], h, el, this.save_data[3]);            
			return this.solution[1][this.solution[1].length - 1];
        });

		// Return to initial data
		this._create_solution(...this.save_data);

		return [kappa, freq];
	}
}
