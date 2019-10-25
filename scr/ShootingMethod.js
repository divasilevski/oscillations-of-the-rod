/** Create solution by shooting method */
class ShootingMethod extends Methods{
	// redefinition
	_create_solution(func, h, kappa, p) {
		// Create system and initial values
		let sys = (x, y, z) => [-kappa * kappa * z, y / func(x)];
		let init = [1, 0];

		// Solve system
		let runge_kutta = new RungeKutta(sys, init, 0, 1, h);

		// Get results
		this.x = runge_kutta.x;
		this.solution = runge_kutta.z;

		// Find A
		let A = p / runge_kutta.y[this._value_index(1.0)];

		// Myltiply on A
		this.solution = [this.x, this.solution.map(el => el * A)];
	}
}
