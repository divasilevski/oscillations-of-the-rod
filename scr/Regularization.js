class Regularization {
    /** Обратная задача по отысканию итегрального уравнения 
     * Фредгольма I рода методом регуляризации Тихонова 
     * с автоматическим подбором параметра регуляризации
     * 
     * @method getSolution() Получение восстановленного решения
     * @method getExact() Получение точного решения
     * @method getPoints() Получение точек для построения графика
     * @method getAlpha() Получение параметра регуляризации
     * @method getIteration() Получение количества итераций
     * 
     * @function func_kernel(x,s,i,j) Функция для формирования ядра
     * @function func_exact(s,i) Функция точного решения
     * @function func_right(x,i) Функция правой части уравнения
     * 
     * @param {Array<Number>} init_condition Начальные условия [a,b,c,d]
     * @param {Number} points_count Количество точек для разбиения
     * @param {Number} init_alpha Начальное значение параметра регуляризации
     * @param {Number} eps Погрешность определения параметра регуляризации
     * @param {Number} h Погрешность оператора
     * @param {Number} delta Погрешность правой части
     * 
     * @param {Number} max_iter Максимальное количество итераций для поиска
     * @param {Number} boundary_condition Граничные условия [left, right] 
     *  со значениями "Neumann" или "Dirichle"
     */
    constructor(
        init_condition = [0, 1, 0, 1],
        points_count = 10,
        init_alpha = 0.1e-6,
        eps = 0.00001,
        h = 0,
        delta = 0
    ) {
        // Public parameters
        this.func_kernel = undefined;
        this.func_exact = undefined;
        this.func_right = undefined;

        this.init_condition = init_condition;
        this.points_count = points_count;
        this.init_alpha = init_alpha;
        this.eps = eps;
        this.h = h;
        this.delta = delta;

        // Public settings
        this.max_iter = 50;
        this.boundary_condition = ["Neumann", "Neumann"];

        // Private data
        this._data = {};
    }

    getSolution() {
        // Проверка на входящие функции
        console.assert(
            this.func_kernel != undefined,
            "Функция для ядра не задана!"
        );
        console.assert(
            this.func_exact != undefined || this.func_right != undefined,
            "Функция точного решения или правой части не задана"
        );

        // Задаем сетку
        let [a, b, c, d] = this.init_condition;
        let n = this.points_count[0];
        let m = this.points_count[1];

        let hs = (b - a) / (n - 1);
        let hx = (d - c) / (m - 1);

        let s = [];
        let x = [];
        for (let i = 0; i < n; i++) s[i] = a + i * hs;
        for (let i = 0; i < m; i++) x[i] = c + i * hx;

        // Записываем данные для вывода
        this._data.points = s;

        // Формируем ядро
        const KERNEL = createKernel(this.func_kernel, s, x, n, m);

        // Формируем правую часть уравнения
        const RIGHT_PART = createRightPart(
            KERNEL,
            this.func_right,
            this.func_exact,
            x,
            s,
            m,
            hs
        );

        // Итерационный процесс для поиска параметра регуляризации
        this.iterativeProcess(KERNEL, RIGHT_PART, n, m, hs, hx);

        return this._data.solution;
    }

    /** Итерационный процесс поиска параметра регуляризации и вывод решения */
    iterativeProcess(K, F, n, m, hs, hx) {
        let alpha_1 = this.init_alpha;
        let alpha_2 = this.init_alpha * 0.5;
        let res_1 = this.residual(...arguments, alpha_1); // Невязка для alpha_1
        let res_2 = this.residual(...arguments, alpha_2); // Невязка для alpha_2

        let alpha; // alpha по формулам
        let coeff; // Упрощаем запись, добавляя коэффициент
        let iteration; // Для записи количества итераций

        for (iteration = 1; iteration < this.max_iter; iteration++) {
            // Формируем новую alpha
            coeff = (alpha_1 - alpha_2) * res_2 / (res_2 - res_1);
            alpha = alpha_2 / (1 - 1 / alpha_1 * coeff);
            
            // Проверка на погрешность определения параметра регуляризации
            if (Math.abs(alpha_2 - alpha) < this.eps) break;

            // Переопределяем переменные
            [alpha_1, alpha_2, res_1] = [alpha_2, alpha, res_2];
            res_2 = this.residual(...arguments, alpha);
        }

        // Записываем данные для вывода
        this._data.iteration = iteration;
        this._data.alpha = alpha;
        this._data.solution = this.tikhonov(...arguments, alpha_1);
    }

    /** Обобщенная невязка */
    residual(K, F, n, m, hs, hx, alpha) {
        // Находим решение
        let solution = this.tikhonov(...arguments);
        
        // Умножаем ядро на решение
        let temp = LinearAlgebra.dot(K, solution);
        
        // Отнимаем правую часть, возводим в квадрат и суммируем
        let mu = 0;
        for (let i = 0; i < m; i++) {
            mu += (temp[i] * hs - F[i]) * (temp[i] * hs - F[i]) * hx;
        }

        // Норма решения
        let norm = LinearAlgebra.norm(solution);
        

        // По формуле невязки получаем:
        return mu - (this.delta + this.h * norm) ** 2;
    }

    /** Метод регуляризации Тихонова для конкретного alpha*/
    tikhonov(K, f, n, m, hs, hx, alpha) {
        // ИСПОЛЬЗУЕМ ФОРМУЛЫ

        // Формируем вектор F - правая часть уравнения Эйлера
        let F = [];
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let k = 0; k < m; k++) sum += K[k][i] * f[k];
            F[i] = hx * sum;
        }

        // Работаем с левой частью уравнения Эйлера
        let C = stabilizer(n, hs, ...this.boundary_condition);
        let B = LinearAlgebra.zeros(n);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let sum = 0;
                for (let k = 0; k < m; k++) {
                    sum += K[k][i] * K[k][j];
                }
                B[i][j] = sum * hx;
            }
        }

        // Формируем левую часть уравнения Эйлера B_alpha
        let B_alpha = LinearAlgebra.zeros(n);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                B_alpha[i][j] = hs * (B[i][j] + alpha * C[i][j]);
            }
        }
        // Решение СЛАУ
        return LinearAlgebra.solve(B_alpha, F);
    }

    /** Получение количества итераций */
    getIteration() {
        return this._data.iteration;
    }

    /** Получение вычисленного параметра регуляризации */
    getAlpha() {
        return this._data.alpha;
    }

    /** Получение точного решения */
    getExact() {
        return createExact(
            this.func_exact,
            this._data.points,
            this.points_count[0]
        );
    }

    /** Получение точек сетки */
    getPoints() {
        return this._data.points;
    }
}

/** Функция формирет ядро по заданной сетке */
function createKernel(func_kernel, s, x, n, m) {
    let K = [];
    for (let i = 0; i < m; i++) {
        K.push([]);
        for (let j = 0; j < n; j++) {
            // Края матрицы делим на 2 для гладкости
            K[i].push(
                j != 0 && j != n - 1
                    ? func_kernel(x[i], s[j], i, j)
                    : func_kernel(x[i], s[j], i, j) / 2
            );
        }
    }
    return K;
}

/** Функция формирет правую часть по заданной сетке 
 * с помощью функции func_right(x, i),
 * либо c помощью функции точного решения,
 * если первая не задана (undefined)
*/
function createRightPart(K, func_right, func_exact, x, s, m, hs) {
    let F = [];
    if (func_right == undefined) {
        F = LinearAlgebra.dot(K, createExact(func_exact, x, m));
        for (let j = 0; j < m; j++) F[j] *= hs;
    } else {
        for (let j = 0; j < m; j++) F[j] = func_right(x[j], j);
    }
    return F;
}

/** Функция формирет точное решение по заданной сетке */
function createExact(func_exact, s, m) {
    console.assert(
        func_exact != undefined,
        "Функция точного решения не задана."
    );

    let E = [];
    for (let j = 0; j < m; j++) E[j] = func_exact(s[j], j);
    return E;
}

/** Регуляризирующая или стабилизирующая матрица */
function stabilizer(n, step, left, right) {
    // Формируем главную диагональ в виде вектора
    let diagonal = [];
    let h = 1.0 / step / step;
    for (let i = 0; i < n; i++) diagonal.push(1 + 2 * h);

    // Граничные условия
    diagonal[0] = left == "Dirichle" ? 1 + 3 * h : 1 + h;
    diagonal[n - 1] = right == "Dirichle" ? 1 + 3 * h : 1 + h;

    // Добавляем главную диагональ
    let matrix = LinearAlgebra.zeros(n);
    for (let i = 0; i < n; i++) {
        matrix[i][i] = diagonal[i];
    }

    // Добавляем верхнюю и нижнюю диагонали
    for (let i = 1; i < n; i++) {
        matrix[i - 1][i] = -h;
        matrix[i][i - 1] = -h;
    }

    return matrix;
}
