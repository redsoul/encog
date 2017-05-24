describe('Matrix', function () {
    const Matrix = require(PATHS.MATRICES + 'matrix');
    const MatrixError = require(PATHS.ERROR_HANDLING + 'matrix');

    beforeEach(function () {
    });

    describe('constructor', function () {
        it('should create a matrix from an multidimensional array', function () {
            const matrix = new Matrix([[1, 2, 3], [4, 5, 6]]);
            expect(matrix.getData()).toEqual([[1, 2, 3], [4, 5, 6]])
        });

        it('should create a matrix with specific rows and column sizes', function () {
            const matrix = new Matrix(2, 3);
            expect(matrix.getData()).toEqual([[0, 0, 0], [0, 0, 0]])
        });

        it('should create a matrix with specific rows and column sizes and default value', function () {
            const matrix = new Matrix(3, 2, 1);
            expect(matrix.getData()).toEqual([[1, 1], [1, 1], [1, 1]])
        });

        it('should throw an exceptions', function () {
            expect(()=> new Matrix(3)).toThrow(new MatrixError('Invalid Matrix arguments'));
        });
    });

    describe('addValue method', function () {
        let matrix;
        beforeEach(function () {
            matrix = new Matrix([[1, 1, 1], [1, 1, 1]]);
        });

        it('should throw an exception for not have valid coordinates', function () {
            expect(()=>matrix.addValue(5, 5, 1)).toThrow(new MatrixError('The row:5 is out of range:2'));
        });

        it('should add the value to the matrix on the given coordinates', function () {
            matrix.addValue(1, 1, 1);
            expect(matrix.getData()).toEqual([[1, 1, 1], [1, 2, 1]]);

            matrix.addValue(0, 0, -4);
            expect(matrix.getData()).toEqual([[-3, 1, 1], [1, 2, 1]]);
        });
    });

});