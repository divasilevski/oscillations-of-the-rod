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
        console.log(C);
    }

    solution() {
        return 1;
    }
}

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

function zeros(N) {
    // Создаем матрицу из нулей
    let matrix = [];
    for (let i = 0; i < N; i++) {
        matrix.push([]);
        for (let j = 0; j < N; j++) {
            matrix[i][j] = 0;
        }
    }
    return matrix;
}

/*****************************************************************************/
function kernel(x, kappa, k, a) {
    // Ядро интеграла
    let gamma = Math.sqrt(a * a - kappa * kappa / (1 + k * k));
    return (
        -kappa *
        kappa *
        (1 - k * k) *
        Math.sinh(gamma * x) *
        Math.cosh(gamma * x) /
        ((1 + k * k) *
            (1 + k * k) *
            gamma *
            Math.cosh(gamma) *
            Math.cosh(gamma))
    );
}

const PI = 3.1415926538;
const N = 10; // Количество точек
let min_kappa = 0;
let max_kappa = 1;
let alpha = 1.0;
let k = 1.0;

let step_kappa = (max_kappa - min_kappa) / N;
let h = 1 / N;
f = i => sin(PI * i * h);

let kappa;
let row;
let matrix = [];
for (let i = 0; i < N; i++) {
    kappa = min_kappa + step_kappa * i;
    row = [];
    for (let j = 0; j < N; j++)
        row.push(h * kernel((j + 0.5) * h, kappa, k, alpha));
    matrix.push(row);
}

let sum;
let right_part = [];
for (let i = 0; i < N; i++) {
    sum = 0;
    for (let j = 0; j < N; j++) {
        sum += matrix[i][j] * f[j];
    }
    right_part.push(sum);
}

regularization = new Regularization(matrix, right_part, h);

console.log(regularization.solution());
