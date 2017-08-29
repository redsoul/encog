const ArrayUtils = require(PATHS.UTILS + 'array');
const MatrixError = require(PATHS.ERROR_HANDLING + 'matrix');

/**
 * This class implements a mathematical matrix. Matrix math is very important to
 * neural network processing. Many of the neural network classes make use of the
 * matrix classes in this package.
 */
class Matrix {
    /**
     * Create a blank array with the specified number of rows and columns.
     *
     * @param rows {number} || {Matrix}
     *            How many rows in the matrix.
     * @param cols {number}
     *            How many columns in the matrix.
     * @param defaultValue {number}
     */
    constructor(rows, cols, defaultValue = 0) {
        this.matrix = [];
        if (arguments[0].constructor.name == 'Array') {
            this.setMatrix(arguments[0])
        } else if ((
            arguments.length === 3 &&
            arguments[0].constructor.name == 'Number' &&
            arguments[1].constructor.name == 'Number' &&
            arguments[2].constructor.name == 'Number') || (
            arguments.length === 2 &&
            arguments[0].constructor.name == 'Number' &&
            arguments[1].constructor.name == 'Number')) {
            for (var i = 0; i < rows; i++) {
                this.matrix[i] = [];
                for (var j = 0; j < cols; j++) {
                    this.matrix[i][j] = defaultValue;
                }
            }
        } else {
            throw new MatrixError('Invalid Matrix arguments');
        }
    }

    /**
     * @param M {Array}
     */
    setMatrix(M) {
        for (let i = 0; i < M.length; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < M[0].length; j++) {
                this.matrix[i][j] = M[i][j];
            }
        }
    }

    /**
     * Set all rows and columns to zero.
     */
    clear() {
        for (let r = 0; r < this.getRows(); r++) {
            for (let c = 0; c < this.getCols(); c++) {
                this.matrix[r][c] = 0;
            }
        }
    }

    /**
     * Create a copy of the matrix.
     *
     * @return {Matrix} A colne of the matrix.
     */
    clone() {
        return new Matrix(this.matrix);
    }

    /**
     * Read the specified cell in the matrix.
     *
     * @param row {Number}
     *            The row to read.
     * @param col {Number}
     *            The column to read.
     * @return {Number} The value at the specified row and column.
     */
    get(row, col) {
        this._validate(row, col);
        return this.matrix[row][col];
    }

    /**
     * Set an individual cell in the matrix to the specified value.
     *
     * @param row {Number}
     *            The row to set.
     * @param col {Number}
     *            The column to set.
     * @param value {Number}
     *            The value to be set.
     */
    set(row, col, value) {
        this._validate(row, col);
        this.matrix[row][col] = value;
    }

    /**
     * Increment an individual cell in the matrix with the specified value.
     *
     * @param row {Number}
     *            The row to set.
     * @param col {Number}
     *            The column to set.
     * @param value {Number}
     *            The value to be set.
     */
    inc(row, col, value) {
        this._validate(row, col);
        this.matrix[row][col] += value;
    }

    /**
     * Get the columns in the matrix.
     *
     * @return {Number} The number of columns in the matrix.
     */
    getCols() {
        return this.matrix[0].length;
    }

    /**
     * @return {Array} Get the 2D matrix array.
     */
    getData() {
        return this.matrix;
    }

    /**
     * Get the number of rows in the matrix.
     *
     * @return {Number} The number of rows in the matrix.
     */
    getRows() {
        return this.matrix.length;
    }

    /**
     * Get the size of the array. This is the number of elements it would take
     * to store the matrix as a packed array.
     *
     * @return {number} The size of the matrix.
     */
    size() {
        return this.getCols() * this.getRows();
    }

    /**
     * Is the matrix non singular?
     *
     * @return {boolean}
     */
    isNonSingular() {
        for (let j = 0; j < this.getCols(); j++) {
            if (this.matrix[j][j] == 0)
                return false;
        }
        return true;
    }

    /**
     * @param M {Matrix}
     * */
    add(M) {
        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {
                this.matrix[row][col] += M.get(row, col);
            }
        }
    }

    /**
     * Add a value to one cell in the matrix.
     *
     * @param row {Number}
     *            The row to add to.
     * @param col {Number}
     *            The column to add to.
     * @param value {Number}
     *            The value to add to the matrix.
     */
    addValue(row, col, value) {
        this._validate(row, col);
        this.matrix[row][col] += value;
    }

    /**
     * Read one entire column from the matrix as a sub-matrix.
     *
     * @param col {Number}
     *            The column to read.
     * @return {Matrix} The column as a sub-matrix.
     */
    getCol(col) {
        if (col > this.getCols()) {
            throw new MatrixError("Can't get column #" + col + " because it does not exist.");
        }

        let newMatrix = ArrayUtils.newIntArray(this.getRows(), new Array(1));

        for (let row = 0; row < this.getRows(); row++) {
            newMatrix[row][0] = this.matrix[row][col];
        }

        return new Matrix(newMatrix);
    }

    /**
     * Get the specified row as a sub-matrix.
     *
     * @param row {Number}
     *            The row to get.
     * @return {Matrix} A matrix.
     */
    getRow(row) {
        if (row > this.getRows()) {
            throw new MatrixError("Can't get row #" + row + " because it does not exist.");
        }

        let newMatrix = ArrayUtils.newIntArray(this.getCols());

        for (let col = 0; col < this.getCols(); col++) {
            newMatrix[0][col] = this.matrix[row][col];
        }

        return new Matrix(newMatrix);
    }

    /**
     * Determine if the matrix is a vector. A vector is has either a single
     * number of rows or columns.
     *
     * @return {Boolean} True if this matrix is a vector.
     */
    isVector() {
        if (this.getRows() == 1) {
            return true;
        }
        return this.getCols() == 1;
    }

    each(cb) {
        let value;
        cb = cb || function () {
            };
        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {
                value = cb(row, col, this.get(row, col));
                if (!isNaN(value)) {
                    this.set(row, col, value);
                }
            }
        }
    }

    /**
     * Validate that the specified row and column are within the required
     * ranges. Otherwise throw a MatrixError exception.
     *
     * @param row {Number}
     *            The row to check.
     * @param col {Number}
     *            The column to check.
     */
    _validate(row, col) {
        if ((row >= this.getRows()) || (row < 0)) {
            throw new MatrixError("The row:" + row + " is out of range:" + this.getRows());
        }

        if ((col >= this.getCols()) || (col < 0)) {
            throw new MatrixError("The col:" + col + " is out of range:" + this.getCols());
        }
    }
}

module.exports = Matrix;