describe('Matrix Math', function () {
    const Matrix = require(PATHS.MATRICES + 'matrix');
    const MatrixMath = require(PATHS.MATRICES + 'math');
    const MatrixError = require(PATHS.ERROR_HANDLING + 'matrix');

    beforeEach(function () {
    });

    describe('add method', function () {
        it('valid matrices', function () {
            const mat1 = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
            const mat2 = new Matrix([[1, 2, 3], [3, 2, 1], [2, 2, 2]]);
            const mat3 = MatrixMath.add(mat1, mat2);


            expect(mat3.getData()).toEqual([[2, 3, 4], [4, 3, 2], [3, 3, 3]]);
        });

        it('different column size matrices', function () {
            const mat1 = new Matrix([[1, 1], [1, 1], [1, 1]]);
            const mat2 = new Matrix([[1, 2, 3], [3, 2, 1], [2, 2, 2]]);

            expect(()=>MatrixMath.add(mat1, mat2)).toThrow();
        });

        it('different row size matrices', function () {
            const mat1 = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
            const mat2 = new Matrix([[1, 2, 3], [3, 2, 1]]);

            expect(()=>MatrixMath.add(mat1, mat2)).toThrow();
        });
    });

    describe('subtract method', function () {
        it('square matrices', function () {
            const mat1 = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
            const mat2 = new Matrix([[1, 2, 3], [3, 2, 1], [2, 2, 2]]);
            const mat3 = MatrixMath.subtract(mat1, mat2);

            expect(MatrixMath.subtract(mat1, mat2).getData()).toEqual([[0, -1, -2], [-2, -1, 0], [-1, -1, -1]]);
            expect(MatrixMath.subtract(mat2, mat1).getData()).toEqual([[0, 1, 2], [2, 1, 0], [1, 1, 1]]);
        });

        it('different column size matrices', function () {
            const mat1 = new Matrix([[1, 1], [1, 1], [1, 1]]);
            const mat2 = new Matrix([[1, 2, 3], [3, 2, 1], [2, 2, 2]]);

            expect(()=>MatrixMath.subtract(mat1, mat2)).toThrow();
        });

        it('different row size matrices', function () {
            const mat1 = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
            const mat2 = new Matrix([[1, 2, 3], [3, 2, 1]]);

            expect(()=>MatrixMath.subtract(mat1, mat2)).toThrow();
        });
    });

    describe('dot product method', function () {
        it('two vectors', function () {
            expect(MatrixMath.dot(new Matrix([[2, 4, 1]]), new Matrix([[2, 2, 3]]))).toBe(15);
            expect(MatrixMath.dot(new Matrix([[2, 4, 1]]), new Matrix([[2], [2], [3]]))).toBe(15);
            expect(MatrixMath.dot(new Matrix([[2], [4], [1]]), new Matrix([[2, 2, 3]]))).toBe(15);
        });

        // it('vectors and matrix', function () {
        //     expect(MatrixMath.dot(new Matrix([[1, 2]]), new Matrix([[1, 2], [3, 4], [5, 6]]))).toBe(15);
        // });
    });

    describe('multiply method', function () {

        it('matrix multiply by number', function () {
            const mat1 = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
            const mat2 = MatrixMath.multiply(mat1, 2);

            expect(mat2.getData()).toEqual([[2, 2, 2], [2, 2, 2], [2, 2, 2]]);
        });

        describe('multiply 2 matrices', function () {
            it('with square matrices', function () {
                const mat1 = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
                const mat2 = new Matrix([[1, 2, 3], [3, 2, 1], [2, 2, 2]]);
                const mat3 = MatrixMath.multiply(mat1, mat2);

                expect(mat3.getData()).toEqual([[6, 6, 6], [6, 6, 6], [6, 6, 6]]);
            });

            it('with different size matrices', function () {
                const mat1 = new Matrix([[1, 1], [1, 1], [1, 1]]);
                const mat2 = new Matrix([[1, 2, 3], [3, 2, 1]]);

                expect(MatrixMath.multiply(mat2, mat1).getData()).toEqual([[6, 6], [6, 6]]);
                expect(MatrixMath.multiply(mat1, mat2).getData()).toEqual([[4, 4, 4], [4, 4, 4], [4, 4, 4]]);
            });

            it('invalid matrices sizes', function () {
                const mat1 = new Matrix([[1, 1], [1, 1], [1, 1]]);
                const mat2 = new Matrix([[1, 2, 3], [3, 2, 1], [2, 2, 2]]);

                expect(()=>MatrixMath.multiply(mat1, mat2)).toThrow();
            });
        });
    });

    describe('transpose method', function () {
        it('with square matrices', function () {
            const mat1 = new Matrix([[1, 2, 3], [3, 2, 1], [2, 2, 2]]);

            expect(MatrixMath.transpose(mat1).getData()).toEqual([[1, 3, 2], [2, 2, 2], [3, 1, 2]]);
        });

        it('with non square matrices', function () {
            const mat1 = new Matrix([[1, 2, 3], [3, 2, 1]]);
            const mat2 = new Matrix([[1, 2], [3, 2], [2, 2]]);

            expect(MatrixMath.transpose(mat1).getData()).toEqual([[1, 3], [2, 2], [3, 1]]);
            expect(MatrixMath.transpose(mat2).getData()).toEqual([[1, 3, 2], [2, 2, 2]]);
        });
    });

    describe('identity method', function () {
        it('with 0 size', function () {
            expect(()=>MatrixMath.identity(0)).toThrow();
        });

        it('with size greater than 0', function () {
            expect(MatrixMath.identity(1).getData()).toEqual([[1]]);
            expect(MatrixMath.identity(2).getData()).toEqual([[1, 0], [0, 1]]);
            expect(MatrixMath.identity(3).getData()).toEqual([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        });
    });
});