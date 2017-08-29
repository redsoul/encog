const MatrixError = require(PATHS.ERROR_HANDLING + 'matrix');
const Matrix = require(PATHS.MATRICES + 'matrix');
/**
 * This class can perform many different mathematical operations on matrixes.
 * The matrixes passed in will not be modified, rather a new matrix, with the
 * operation performed, will be returned.
 */
class MatrixMath {

    /**
     * Add two matrixes.
     *
     * @param a {Matrix} The first matrix to add.
     * @param b {Matrix} The second matrix to add.
     * @return {Matrix} A new matrix of the two added.
     */
    static add(a, b) {
        if (a.getRows() != b.getRows()) {
            throw new MatrixError(
                "To add the matrices they must have the same number of "
                + "rows and columns.  Matrix a has " + a.getRows()
                + " rows and matrix b has " + b.getRows()
                + " rows.");
        }

        if (a.getCols() != b.getCols()) {
            throw new MatrixError(
                "To add the matrices they must have the same number "
                + "of rows and columns.  Matrix a has "
                + a.getCols() + " cols and matrix b has "
                + b.getCols() + " cols.");
        }

        let result = new Matrix(a.getRows(), a.getCols());

        for (let resultRow = 0; resultRow < a.getRows(); resultRow++) {
            for (let resultCol = 0; resultCol < a.getCols(); resultCol++) {
                result.set(resultRow, resultCol, a.get(resultRow, resultCol) + b.get(resultRow, resultCol));
            }
        }

        return result;
    }

    /**
     * Return the result of multiplying every cell in the matrix by the
     * specified value.
     *
     * @param a {Matrix} The matrix.
     * @param b {Matrix | Number} The value
     * @return {Matrix} The result of the multiplication.
     */
    static multiply(a, b) {
        let result;
        const multiplierType = b.constructor.name;

        if (multiplierType === 'Number') {
            result = new Matrix(a.getRows(), a.getCols());
            for (let row = 0; row < a.getRows(); row++) {
                for (let col = 0; col < a.getCols(); col++) {
                    result.set(row, col, a.get(row, col) * b);
                }
            }

        } else {
            if (b.getRows() != a.getCols()) {
                throw new MatrixError(
                    "To use ordinary matrix multiplication the number of "
                    + "columns on the first matrix must mat the number of "
                    + "rows on the second.");
            }

            result = new Matrix(a.getRows(), b.getCols());
            const bcolj = [];
            let s;
            for (let j = 0; j < b.getCols(); j++) {
                for (let k = 0; k < a.getCols(); k++) {
                    bcolj[k] = b.get(k, j);
                }
                for (let i = 0; i < a.getRows(); i++) {
                    s = 0;
                    for (let k = 0; k < a.getCols(); k++) {
                        s += a.get(i, k) * bcolj[k];
                    }
                    result.set(i, j, s);
                }
            }
        }

        return result;
    }

    /**
     * Compute the dot product for the two matrices
     *
     * @param a {Matrix} The first matrix.
     * @param b {Matrix} The second matrix.
     * @return {Number} The dot product.
     */
    static dot(a, b) {
        if (!a.isVector() || !b.isVector()) {
            let result = [];
            for (let row = 0; row < a.getRows(); row++) {
                result.push(MatrixMath.dot(a.getRow(row), b.getCol(row)));
            }
        }

        const aArray = a.getData();
        const bArray = b.getData();

        const aLength = aArray.length == 1 ? aArray[0].length : aArray.length;
        const bLength = bArray.length == 1 ? bArray[0].length : bArray.length;

        if (aLength != bLength) {
            throw new MatrixError("To take the dot product, both matrices must be of the same length.");
        }

        let result = 0;
        if (aArray.length == 1 && bArray.length == 1) {
            for (let i = 0; i < aLength; i++) {
                result += aArray[0][i] * bArray[0][i];
            }
        }
        else if (aArray.length == 1 && bArray[0].length == 1) {
            for (let i = 0; i < aLength; i++) {
                result += aArray[0][i] * bArray[i][0];
            }
        }
        else if (aArray[0].length == 1 && bArray.length == 1) {
            for (let i = 0; i < aLength; i++) {
                result += aArray[i][0] * bArray[0][i];
            }
        }
        else if (aArray[0].length == 1 && bArray[0].length == 1) {
            for (let i = 0; i < aLength; i++) {
                result += aArray[i][0] * bArray[i][0];
            }
        }

        return result;

    }

    /**
     * Return the transposition of a matrix.
     *
     * @param input {Matrix} The matrix to transpose.
     * @return {Matrix} The matrix transposed.
     */
    static transpose(input) {
        const transposeMatrix = new Matrix(input.getCols(), input.getRows());
        for (let r = 0; r < input.getRows(); r++) {
            for (let c = 0; c < input.getCols(); c++) {
                transposeMatrix.set(c, r, input.get(r, c));
            }
        }

        return transposeMatrix;
    }

    /**
     * Return an identity matrix of the specified size.
     *
     * @param size {Number}
     *            The number of rows and columns to create. An identity matrix
     *            is always square.
     * @return {Matrix} An identity matrix.
     */
    static identity(size) {
        if (size < 1) {
            throw new MatrixError("Identity matrix must be at least of " + "size 1.");
        }

        const result = new Matrix(size, size);

        for (let i = 0; i < size; i++) {
            result.set(i, i, 1);
        }

        return result;
    }

    /**
     * Return the results of subtracting one matrix from another.
     *
     * @param a {Matrix} The first matrix.
     * @param b {Matrix} The second matrix.
     * @return {Matrix} The results of the subtraction.
     */
    static subtract(a, b) {
        if (a.getRows() != b.getRows()) {
            throw new MatrixError(
                "To subtract the matrices they must have the same "
                + "number of rows and columns.  Matrix a has "
                + a.getRows() + " rows and matrix b has "
                + b.getRows() + " rows.");
        }

        if (a.getCols() != b.getCols()) {
            throw new MatrixError(
                "To subtract the matrices they must have the same "
                + "number of rows and columns.  Matrix a has "
                + a.getCols() + " cols and matrix b has "
                + b.getCols() + " cols.");
        }

        const result = new Matrix(a.getRows(), a.getCols());

        for (let resultRow = 0; resultRow < a.getRows(); resultRow++) {
            for (let resultCol = 0; resultCol < a.getCols(); resultCol++) {
                result.set(resultRow, resultCol, a.get(resultRow, resultCol) - b.get(resultRow, resultCol));
            }
        }

        return result;
    }
}

module.exports = MatrixMath;