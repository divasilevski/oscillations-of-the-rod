const FUNC = x => 1.0 + (x * x) / 50; // My E(x) function for opt. 6
const STEP = 0.1;
const KAPPA = 1.5;
const P = -1;

// set integral Error
Integral.setStep(0.001)

// Create solution
let sm = new ShootingMethod(FUNC, STEP, KAPPA, P);
let cm = new CollocationMethod(FUNC, STEP, KAPPA, P);

const MAX_KAPPA = 5;
const METHOD_STEP = 0.1;
const KAPPA_STEP = 0.1;

// Create frequency response
let fr_sm = sm.frequencyResponse(0, MAX_KAPPA, KAPPA_STEP, METHOD_STEP);
let fr_cm = cm.frequencyResponse(0, MAX_KAPPA, KAPPA_STEP, METHOD_STEP);

// Create charts
let labels = ["x", "Shooting Method", "Collocation Method"];

plot("W(x), kappa = " + KAPPA, labels, [sm.solution, cm.solution], "lines");
plot("W(kappa), x = 1.0", labels, [fr_sm, fr_cm], "points", [-10, 10]);

// Compare results
console.table([sm.solution[0],sm.solution[1], cm.solution[1]])