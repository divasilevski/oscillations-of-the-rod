// let func_kernel = (x, s) => 1 / (1 + 100 * (x - s) * (x - s));
// let func_exact = s => Math.exp(-(s - 0.5) * (s - 0.5) / 0.06);

const N = 101;
const FUNC = x => 1.0 + x * x / 50; // My E(x) function for opt. 6
let sm = new ShootingMethod(FUNC, 1 / N, 1, 1);
const MAX_KAPPA = 1;
const KAPPA_STEP = 1 / (N - 1);
const METHOD_STEP = 1 / (N - 1);

// Create frequency response
let fr_sm = sm.frequencyResponse(0, 1, KAPPA_STEP, METHOD_STEP);

let REG = new Regularization(
    [0.0000001, 1, 0.000001, 1],
    [N, N],
    0.1,
    10e-10,
    10e-10,
    0.00000001
);

REG.func_kernel = (x, s, i, j) => Math.cos(x * s) * Math.cos(x * s);
REG.func_exact = (s, i) => 1.0 + s * s / 50;
REG.func_right = (s, i) =>
    fr_sm[1][i] * Math.cos(s) * Math.cos(s) + Math.sin(2 * s) / (2 * s);

let solution = REG.getSolution();
let exact = REG.getExact();
let x = REG.getPoints();
console.log(solution)
console.log(exact)
console.log("x", x)
console.log(REG.getAlpha())
console.log(REG.getIteration())

solution.forEach((e, i) => (solution[i] += 1));

plot(
    "REGULARIZATION",
    ["x", "Точное решение", "Восстановленное решение"],
    [[x, exact], [x, solution]],
    "lines"
);
