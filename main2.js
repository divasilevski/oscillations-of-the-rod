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

let func_kernel = (x, s) => Math.cos(x * s) * Math.cos(x * s);
let func_exact = s => 1.0 + s * s / 50;
let func_right = (s, i) =>
    -fr_sm[1][i] * Math.cos(s) * Math.cos(s) + Math.sin(2 * s) / (2 * s);

let REG = new Regularization(
    func_kernel,
    func_exact,
    //undefined,
    func_right,
    [0.00001, 1, 0, 1],
    [N, N],
    0.0001,
    0.000000000000000001,
    0.000000000000000001,
    0.0001
);

let solution = REG.solution;
REG.solution.forEach((e, i) => (REG.solution[i] += 1));
let x = REG.x;
let у = REG.exact_solution;

plot(
    "REGULARIZATION",
    ["x", "Точное решение", "Восстановленное решение"],
    [[x, у], [x, solution]],
    "lines"
);
