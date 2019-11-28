const FUNC = x => 1.0 + x * x / 50; // My E(x) function for opt. 6
const P = 1;

const N = 100;
const STEP = 1 / (N - 1);
const S = [0, 1];
const X = [1e-5, 1];

const ALPHA = 1e-7;
const EPS = 1e-7;

// Create frequency response
let sm = new ShootingMethod(FUNC, STEP, 0, P);
let fr_sm = sm.frequencyResponse(X[0], X[1], STEP, STEP);

// Tikhonov regularization
let REG = new Regularization([...S, ...X], [N, N], ALPHA, EPS);
REG.func_kernel = (x, s) => Math.cos(x * s) ** 2;
REG.func_exact = s => FUNC(s);
REG.func_right = (s, i) =>
    fr_sm[1][i] * Math.cos(s) ** 2 + Math.sin(2 * s) / (2 * s);

// Get data
let solution = REG.getSolution().map(e => (e += 1));
let exact = REG.getExact();
let x = REG.getPoints();

console.log("Alpha", REG.getAlpha());
console.log("Iteration", REG.getIteration());

plot(
    "E(x)",
    ["x", "Точное решение", "Восстановленное решение"],
    [[x, exact], [x, solution]],
    "lines"
);
