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
        let N = right_part.length;
        let C = stabilizer(N, step, left, right);
        multiply(init_alpha, C);
        multiply(step, matrix);

        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                matrix[i][j] += C[i][j];
            }
        }
        console.log(LinearAlgebra.solve(matrix, right_part));
    }

    solution() {
        return 1;
    }
}

// Стабилизирующая матрица или регуляризирующая
function stabilizer(n, step, left, right) {
    let diagonal = [];
    let h = 1.0 / step / step;
    for (let i = 0; i < n; i++) diagonal.push(1 + 2 * h);

    diagonal[0] = left == "Dirichle" ? 1 + 3 * h : 1 + h;
    diagonal[n - 1] = right == "Dirichle" ? 1 + 3 * h : 1 + h;

    let matrix = zeros(n);
    for (let i = 0; i < n; i++) {
        matrix[i][i] = diagonal[i];
    }

    // Верхняя и нижняя диагональ
    for (let i = 1; i < n; i++) {
        matrix[i - 1][i] = -h;
        matrix[i][i - 1] = -h;
    }

    return matrix;
}

function multiply(number, matrix) {
    let n = matrix.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) matrix[i][j] *= number;
    }
}
/** Создание нулевой матрицы n на n */
function zeros(n) {
    let matrix = [];
    for (let i = 0; i < n; i++) {
        matrix.push([]);
        for (let j = 0; j < n; j++) {
            matrix[i][j] = 0;
        }
    }
    return matrix;
}