class Regularization {
    /**
     * 
     * @param {Array<Array<Number>>} matrix Матрица СЛАУ
     * @param {Array<Number>} right_part Вектор правой части
     * @param {Number} step Длина отрезка разбиения
     * @param {String} left Краевое условие ("Dirichle" | "Neumann")
     * @param {String} right Краевое условие ("Dirichle" | "Neumann")
     * @param {Number} init_alpha Начальное значение параметра регуляризации
     * @param {Number} h Погрешность оператора
     * @param {Number} delta Погрешность правой части
     * @param {Number} eps Погрешность определения параметра регуляризации
     */
    constructor(
        matrix,
        right_part,
        step,
        left = "Dirichle",
        right = "Dirichle",
        init_alpha = 0.1e-6,
        h = 0,
        delta = 0,
        eps = 0.0001
    ) {
        [
            this.matrix,
            this.right_part,
            this.step,
            this.left,
            this.right,
            this.p,
            this.init_alpha,
            this.h,
            this.delta,
            this.eps
        ] = arguments;
    }
}

function stabilizer(n, step, left = "Dirichle", right = "Dirichle") {
    let diagonal = []; // n
    let up_diagonal = []; // n - 1

    let h = 1.0 / step / step;
    for (let i = 0; i < n; i++) diagonal.push(1 + 2 * h);
    for (let i = 0; i < n - 1; i++) up_diagonal.push(-h);

    diagonal[0] = left == "Dirichle" ? 1 + 3 * h : 1 + h;
    diagonal[n - 1] = right == "Dirichle" ? 1 + 3 * h : 1 + h;

    return { diagonal, up_diagonal };
}
