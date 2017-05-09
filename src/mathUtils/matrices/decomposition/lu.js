const ArrayUtils = require(PATHS.UTILS + 'array');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');

class LUDecomposition {
    /**
     * LU Decomposition
     * Structure to access L, U and piv.
     * @param A {Array} Rectangular matrix
     * */
    constructor(A) {
        this.LU = ArrayUtils.arrayClone(A);

        this.m = A.length;
        this.n = A[0].length;

        this.piv = ArrayUtils.newIntArray(this.m);
        for (let i = 0; i < this.m; i++) {
            this.piv[i] = i;
        }

        this.pivsign = 1;
        let LUrowi;
        let LUcolj = ArrayUtils.newFloatArray(this.m);

        // Outer loop.

        for (let j = 0; j < this.n; j++) {

            // Make a copy of the j-th column to localize references.
            for (let i = 0; i < this.m; i++) {
                LUcolj[i] = this.LU[i][j];
            }

            // Apply previous transformations.
            for (let i = 0; i < this.m; i++) {
                LUrowi = this.LU[i];

                // Most of the time is spent in the following dot product.

                let kmax = Math.min(i, j);
                let s = 0.0;
                for (let k = 0; k < kmax; k++) {
                    s += LUrowi[k] * LUcolj[k];
                }

                LUrowi[j] = LUcolj[i] -= s;
            }

            // Find pivot and exchange if necessary.

            let p = j;
            for (let i = j + 1; i < this.m; i++) {
                if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
                    p = i;
                }
            }
            if (p != j) {
                for (let k = 0; k < this.n; k++) {
                    let t = this.LU[p][k];
                    this.LU[p][k] = this.LU[j][k];
                    this.LU[j][k] = t;
                }
                let k = this.piv[p];
                this.piv[p] = this.piv[j];
                this.piv[j] = k;
                this.pivsign = -this.pivsign;
            }

            // Compute multipliers.
            if (j < this.m && this.LU[j][j] != 0.0) {
                for (let i = j + 1; i < this.m; i++) {
                    this.LU[i][j] /= this.LU[j][j];
                }
            }
        }
    }

    /**
     * Is the matrix nonsingular?
     *
     * @return {boolean} true if U, and hence A, is nonsingular.
     */
    isNonSingular() {
        for (let j = 0; j < this.n; j++) {
            if (this.LU[j][j] == 0)
                return false;
        }
        return true;
    }

    /**
     * Return lower triangular factor
     *
     * @return {Array} L
     */
    getL() {
        let L = ArrayUtils.matrix(this.m, this.n);
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                if (i > j) {
                    L[i][j] = this.LU[i][j];
                } else if (i == j) {
                    L[i][j] = 1.0;
                } else {
                    L[i][j] = 0.0;
                }
            }
        }
        return L;
    }

    /**
     * Return upper triangular factor
     *
     * @return {Array} U
     */
    getU() {
        let U = ArrayUtils.matrix(this.n, this.n);
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                if (i <= j) {
                    U[i][j] = this.LU[i][j];
                } else {
                    U[i][j] = 0.0;
                }
            }
        }
        return U;
    }

    /**
     * Return pivot permutation vector
     *
     * @return {Array} piv
     */
    getPivot() {
        let p = ArrayUtils.newIntArray(this.m);
        for (let i = 0; i < this.m; i++) {
            p[i] = this.piv[i];
        }
        return p;
    }

    /**
     * Return pivot permutation vector as a one-dimensional double array
     *
     * @return {Array} piv
     */
    getDoublePivot() {
        return this.getPivot();
    }

    /**
     * Determinant
     *
     * @return {Number} det(A)
     * @exception IllegalArgumentException
     *                Matrix must be square
     */

    det() {
        if (this.m != this.n) {
            throw new NeuralNetworkError("Matrix must be square.");
        }
        let d = this.pivsign;
        for (let j = 0; j < this.n; j++) {
            d *= this.LU[j][j];
        }
        return d;
    }

    /**
     * Solve A*X = B
     *
     * @param {Array} value
     * @return {Array}
     * @exception NeuralNetworkError
     *                Matrix row dimensions must agree.
     * @exception NeuralNetworkError
     *                Matrix is singular.
     */

    Solve(value) {
        if (value == null) {
            throw new NeuralNetworkError("value");
        }

        if (value.length != this.LU.length) {
            throw new NeuralNetworkError("Invalid matrix dimensions.");
        }

        if (!this.isNonSingular()) {
            throw new NeuralNetworkError("Matrix is singular");
        }

        // Copy right hand side with pivoting
        let count = value.length;
        let b = ArrayUtils.newFloatArray(count);
        for (let i = 0; i < b.length; i++) {
            b[i] = value[this.piv[i]];
        }

        let rows = this.LU[0].length;
        let columns = this.LU[0].length;
        let lu = this.LU;


        // Solve L*Y = B
        let X = ArrayUtils.newFloatArray(count);
        for (let i = 0; i < rows; i++) {
            X[i] = b[i];
            for (let j = 0; j < i; j++) {
                X[i] -= lu[i][j] * X[j];
            }
        }

        // Solve U*X = Y;
        for (let i = rows - 1; i >= 0; i--) {
            // double sum = 0.0;
            for (let j = columns - 1; j > i; j--) {
                X[i] -= lu[i][j] * X[j];
            }
            X[i] /= lu[i][i];
        }
        return X;
    }
}

module.exports = LUDecomposition;