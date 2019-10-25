class RungeKutta {
	/** Create solution diff system
	 *
	 * @param {Function} SystemFuncRunge (x, y, z) => [y(x,z), z(x, y)]
	 * @param {Array<Number>} initial_value initial values [x, x]
	 * @param {Number} a left border
	 * @param {Number} b right border
	 * @param {Number} h step
	 *
	 * @getters x, y, z
	 */
	constructor(SystemFuncRunge, initial_value, a, b, h) {
        
        this.SystemFuncRunge = SystemFuncRunge;

		let n = (b - a) / h + 1;
		this.x = [];
		this.y = [];
		this.z = [];

		this.y[0] = initial_value[0];
		this.z[0] = initial_value[1];

		for (let i = 0; i < n; i++) {
			this.x[i] = h * i;
			if (i < n - 1) {
				this.y[i + 1] =
					this.y[i] +
					(1.0 / 6.0) *
						(this.k11(h, this.x[i], this.y[i], this.z[i]) +
							2 * this.k21(h, this.x[i], this.y[i], this.z[i]) +
							2 * this.k31(h, this.x[i], this.y[i], this.z[i]) +
							this.k41(h, this.x[i], this.y[i], this.z[i]));
				this.z[i + 1] =
					this.z[i] +
					(1.0 / 6.0) *
						(this.k12(h, this.x[i], this.y[i], this.z[i]) +
							2 * this.k22(h, this.x[i], this.y[i], this.z[i]) +
							2 * this.k32(h, this.x[i], this.y[i], this.z[i]) +
							this.k42(h, this.x[i], this.y[i], this.z[i]));
			}
        }
	}

	k11(h, x, y, z) {
		return h * this.SystemFuncRunge(x, y, z)[0];
    }
    
	k21(h, x, y, z) {
		return (
			h *
			this.SystemFuncRunge(
				x + h / 2.0,
				y + this.k11(h, x, y, z) / 2.0,
				z + this.k12(h, x, y, z) / 2.0
			)[0]
		);
	}
	k31(h, x, y, z) {
		return (
			h *
			this.SystemFuncRunge(
				x + h / 2.0,
				y + this.k21(h, x, y, z) / 2.0,
				z + this.k22(h, x, y, z) / 2.0
			)[0]
		);
	}

	k41(h, x, y, z) {
		return (
			h *
			this.SystemFuncRunge(
				x + h,
				y + this.k31(h, x, y, z),
				z + this.k32(h, x, y, z)
			)[0]
		);
	}

	k12(h, x, y, z) {
		return h * this.SystemFuncRunge(x, y, z)[1];
	}

	k22(h, x, y, z) {
		return (
			h *
			this.SystemFuncRunge(
				x + h / 2.0,
				y + this.k11(h, x, y, z) / 2.0,
				z + this.k12(h, x, y, z) / 2.0
			)[1]
		);
	}

	k32(h, x, y, z) {
		return (
			h *
			this.SystemFuncRunge(
				x + h / 2.0,
				y + this.k21(h, x, y, z) / 2.0,
				z + this.k22(h, x, y, z) / 2.0
			)[1]
		);
	}

	k42(h, x, y, z) {
		return (
			h *
			this.SystemFuncRunge(
				x + h,
				y + this.k31(h, x, y, z),
				z + this.k32(h, x, y, z)
			)[1]
		);
	}
}
