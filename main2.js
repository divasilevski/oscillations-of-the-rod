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
let k = 0.7;

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
