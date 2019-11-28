/** Create solution by collocation method */
class CollocationMethod extends Methods {
	// redefinition
	_create_solution(func, h, kappa, p) {
		// Create x-vector
		this.x = LinearAlgebra.vector(0, 1, h);

		// Create a-vector (Multiplayer)
		let a = [h / 2, ...this.x.map(el => h).slice(2), h / 2];

		// Create b-vector (Right part)
		let b = this.x.map(
			element => -p * Integral.simpson(x => 1.0 / func(x), 0, element)
		);

		// Create K-matrix (Kernel)
		let K = this.x.map((el_i, i) => {
			return this.x.map((el_j, j) => {
				return (i == j) - a[j] *
					kappa *
					kappa *
					Integral.simpson(
						x => 1.0 / func(x),
						0,
						Math.min(el_i, el_j)
					);
			});
		});

		this.solution = [this.x, LinearAlgebra.solve(K, b)];
	}
}
