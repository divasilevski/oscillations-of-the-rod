class Regularization {
    /** Обратная задача ао отысканию итегрального уравнения Фредгольма I рода 
     * методом регуляризации Тихонова с автоматическим подбором параметра регуляризации
     * 
     * @param {Function} func_kernel Функция для формирования ядра
     * @param {Function} func_exact Функция точного решения
     * @param {Function} func_right Функция правой части уравнения
     * @param {Array<Number>} init_condition Начальные условия [a,b,c,d]
     * @param {Array<Number>} points_count Количество точек для разбиения [n,m]
     * @param {Number} init_alpha Начальное значение параметра регуляризации
     * @param {Number} h Погрешность оператора
     * @param {Number} delta Погрешность правой части
     * @param {Number} eps Погрешность определения параметра регуляризации
     */
    constructor(
        func_kernel,
        func_exact = undefined,
        func_right = undefined,
        init_condition = [0, 1, 0, 1],
        points_count = [10, 10],
        init_alpha = 0.1e-6,
        h = 0,
        delta = 0,
        eps = 0.00001
    ) {
        // Задаем разбиения
        let [a, b, c, d] = init_condition;
        let [n, m] = points_count;

        let hs = (b - a) / (n - 1);
        let hx = (d - c) / (m - 1);

        let s = [];
        let x = [];
        for (let i = 0; i < n; i++) {
            s.push(a + i * hs);
            x.push(c + i * hx);
        }

        // Формируем ядро
        let K = [];
        for (let i = 0; i < m; i++) {
            K.push([]);
            for (let j = 0; j < n; j++) {
                K[i].push(
                    j != 0 && j != n - 1
                        ? func_kernel(x[i], s[j])
                        : func_kernel(x[i], s[j]) / 2
                );
            }
        }

        // Точное решение
        let E = [];
        if (func_exact != undefined) {
            // Если точное решение не задано оставляем вектор пустым
            for (let j = 0; j < n; j++) {
                E.push(func_exact(s[j]));
            }
        }

        // Правая часть
        let F = [];
        if (func_right == undefined) {
            // Если правая часть не задана функцией,
            // формируем её строя с помощью точной.
            F = LinearAlgebra.dot(K, E);
            for (let j = 0; j < n; j++) {
                F[j] *= hs;
            }
        } else {
            for (let j = 0; j < n; j++) {
                F.push(func_right(s[j], j));
            }
        }

        // ИТЕРАЦИОННЫЙ ПРОЦЕСС
        let alpha;
        let alpha1 = init_alpha;
        let alpha2 = init_alpha * 0.5;
        let n1 = this.residual(K, F, n, m, hs, hx, alpha1, h, delta);
        let n2 = this.residual(K, F, n, m, hs, hx, alpha2, h, delta);

        let iter;
        for (iter = 1; iter < 50; iter++) {
            alpha =
                alpha2 / (1 - 1 / alpha1 * (alpha1 - alpha2) * n2 / (n2 - n1));
            n1 = n2;
            n2 = this.residual(K, F, n, m, hs, hx, alpha, h, delta);
            alpha1 = alpha2;
            alpha2 = alpha;
            if (Math.abs(alpha1 - alpha2) < eps) break;
        }
        console.log("iterations:", iter);
        console.log("alpha:", alpha);

        this.solution = this.calculate(K, F, n, m, hs, hx, alpha);
        this.exact_solution = E;
        this.x = x;
    }

    // Обобщенная невязка
    residual(K, F, n, m, hs, hx, alpha, h, delta) {
        let u = this.calculate(K, F, n, m, hs, hx, alpha);

        let temp = LinearAlgebra.dot(K, u);
        let sum = 0;
        for (let i = 0; i < u.length; i++) {
            sum += (temp[i] * hs - F[i]) * (temp[i] * hs - F[i]) * hx;
        }

        return (
            sum -
            (delta + h * LinearAlgebra.norm(u)) *
                (delta + h * LinearAlgebra.norm(u))
        );
    }

    /** Метод регуляризации Тихонова */
    calculate(K, f, n, m, hs, hx, alpha) {
        // ИСПОЛЬЗУЕМ ФОРМУЛЫ

        // Формируем вектор F - правая часть уравнения Эйлера
        let F = [];
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let k = 0; k < m; k++) {
                sum += K[k][i] * f[k];
            }
            F.push(hx * sum);
        }

        // Работаем с левой частью уравнения Эйлера
        let C = stabilizer(n, hs, "Neumann", "Dirichl");
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
}

// Стабилизирующая матрица или регуляризирующая
function stabilizer(n, step, left, right) {
    let diagonal = [];
    let h = 1.0 / step / step;
    for (let i = 0; i < n; i++) diagonal.push(1 + 2 * h);

    diagonal[0] = left == "Dirichle" ? 1 + 3 * h : 1 + h;
    diagonal[n - 1] = right == "Dirichle" ? 1 + 3 * h : 1 + h;

    let matrix = LinearAlgebra.zeros(n);
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
