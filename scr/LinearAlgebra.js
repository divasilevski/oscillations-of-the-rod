class LinearAlgebra {
    /** Решение СЛАУ методом Гаусса-Жордана */
    static solve(M, f) {
        // Константы
        let a = Object.assign([], M);
        //let a = M.slice(0);
        let n = a.length;
        let flag;

        // Составляем СЛАУ
        for (let i = 0; i < n; i++) {
            a[i].push(f[i]);
        }

        // Вычисления
        for (let i = 0; i < n; i++) {
            // Идем по диагонали
            if (a[i][i] != 1) {
                // Убираем 0
                if (a[i][i] == 0) {
                    flag = true;
                    for (let j = i + 1; j < n - 1; j++) {
                        if (a[j][i] != 0) {
                            let ai = a[i];
                            a[i] = a[j];
                            a[j] = ai;
                            flag = false;
                        }
                    }
                    // Выводим null, если нельзя убрать 0
                    if (flag) {
                        return null;
                    }
                }
                // Убираем число неравное 1
                let aii = a[i][i];
                for (let j = 0; j < n + 1; j++) {
                    a[i][j] /= aii;
                }
            }
            // Изменяем строки
            for (let j = 0; j < n; j++) {
                if (j == i || a[j][i] == 0) {
                    continue;
                }
                let aji = a[j][i];
                for (let k = 0; k < n + 1; k++) {
                    a[j][k] -= a[i][k] * aji;
                }
            }
        }
        // Возвращаем результат
        let result = [];
        for (let i = 0; i < n; i++) {
            result.push(a[i][n]);
        }
        return result;
    }

    /** Создание вектора */
    static vector(a, b, h) {
        let n = (b - a) / h;
        let result_array = [];
        for (let i = 0; i < n + 1; i++) {
            result_array.push(a + i * h); 
        }
        return result_array;
    }

    /** Умножение числа на матрицу */
    static multiply(number, matrix) {
        let n = matrix.length;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) matrix[i][j] *= number;
        }
    }

    /** Матрица из нулей размера nxn */
    static zeros(n) {
        let matrix = [];
        for (let i = 0; i < n; i++) {
            matrix.push([]);
            for (let j = 0; j < n; j++) {
                matrix[i][j] = 0;
            }
        }
        return matrix;
    }

    /** Умножение матрицы на вектор */
    static dot(M, v) {
        if (M[0].length != v.length) console.log("incorrect size matrix");
        let sum;
        let result = [];
        for (let i = 0; i < M.length; i++) {
            sum = 0;
            for (let j = 0; j < M[0].length; j++) {
                sum += M[i][j] * v[j];
            }
            result.push(sum);
        }
        return result;
    }

    static norm(vector) {
        let sum = 0;
        for (let i = 0; i < vector.length; i++) {
            sum += vector[i] * vector[i];
        }
        return Math.sqrt(sum);
    }
}
