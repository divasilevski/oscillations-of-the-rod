const FUNC = x => 1.0 + x * x / 50; // My E(x) function for opt. 6
const P = 1;

const N = 10; // Разбиение для X
const M = 15; // Разбиение для S

const X = [0.5,1.2]
const S = [0, 1];
const STEP = (X[1] - X[0]) / (N - 1);

const ALPHA = 1e-7;
const EPS = 1e-7;

// Create frequency response
let sm = new ShootingMethod(FUNC, 0.01);
let fr_sm = sm.frequencyResponse(X[0], X[1], STEP);


// Tikhonov regularization
let REG = new Regularization([...S, ...X], [M, N], ALPHA, EPS);
REG.func_kernel = (x, s) => Math.cos(x * s) ** 2;
REG.func_exact = s => FUNC(s);
REG.func_right = (x, i) =>
    fr_sm[1][i] * Math.cos(x) ** 2 + Math.sin(2 * x) / (2 * x);

// Get data
let solution = REG.getSolution().map(e => (e += 1));
let exact = REG.getExact();
let s = REG.getPoints();

console.log("Alpha", REG.getAlpha());
console.log("Iteration", REG.getIteration());

plot(
    "E(s)",
    ["s", "Точное решение", "Восстановленное решение"],
    [[s, exact], [s, solution]],
    "lines"
);

