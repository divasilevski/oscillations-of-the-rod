let integral_step;

class Integral {
	/** Simpson's rule
	 *
	 * @param {Function} func
	 * @param {Number} a left border
	 * @param {Number} b right border
	 * @param {Number} h step
	 */
	static simpson(func, a, b) {
		let h = 0.001;
		if (integral_step != null) {
			h = integral_step;
		}

		if (a == b) return 0;
		console.assert(a < b);
		let integral = 0.0;
		for (let i = a + h / 2.0; i < b - h / 2; i += h) {
			integral +=
				(h / 6) * (func(i - h / 2) + 4 * func(i) + func(i + h / 2));
		}
		return integral;
	}

	static setStep(x) {
		integral_step = x;
	}
}
