describe('Matrix Math', function () {
    const Encog = require(PATHS.BASE);
    Encog.Log.options.logLevel = 'silent';
    
    const Matrix = require(PATHS.MATRICES + 'matrix');
    const MatrixMath = require(PATHS.MATRICES + 'math');

    beforeEach(function () {
    });

    describe('add method', function () {
         test('valid matrices', function () {
            const mat1 = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
            const mat2 = new Matrix([[1, 2, 3], [3, 2, 1], [2, 2, 2]]);
            const mat3 = MatrixMath.add(mat1, mat2);


            expect(mat3.getData()).toEqual([[2, 3, 4], [4, 3, 2], [3, 3, 3]]);
        });

         test('different column size matrices', function () {
            const mat1 = new Matrix([[1, 1], [1, 1], [1, 1]]);
            const mat2 = new Matrix([[1, 2, 3], [3, 2, 1], [2, 2, 2]]);

            expect(()=>MatrixMath.add(mat1, mat2)).toThrow();
        });

         test('different row size matrices', function () {
            const mat1 = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
            const mat2 = new Matrix([[1, 2, 3], [3, 2, 1]]);

            expect(()=>MatrixMath.add(mat1, mat2)).toThrow();
        });
    });

    describe('subtract method', function () {
         test('square matrices', function () {
            const mat1 = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
            const mat2 = new Matrix([[1, 2, 3], [3, 2, 1], [2, 2, 2]]);
            const mat3 = MatrixMath.subtract(mat1, mat2);

            expect(MatrixMath.subtract(mat1, mat2).getData()).toEqual([[0, -1, -2], [-2, -1, 0], [-1, -1, -1]]);
            expect(MatrixMath.subtract(mat2, mat1).getData()).toEqual([[0, 1, 2], [2, 1, 0], [1, 1, 1]]);
        });

         test('different column size matrices', function () {
            const mat1 = new Matrix([[1, 1], [1, 1], [1, 1]]);
            const mat2 = new Matrix([[1, 2, 3], [3, 2, 1], [2, 2, 2]]);

            expect(()=>MatrixMath.subtract(mat1, mat2)).toThrow();
        });

         test('different row size matrices', function () {
            const mat1 = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
            const mat2 = new Matrix([[1, 2, 3], [3, 2, 1]]);

            expect(()=>MatrixMath.subtract(mat1, mat2)).toThrow();
        });
    });

    describe('dot product method', function () {
         test('two vectors', function () {
            expect(MatrixMath.dot(new Matrix([[2, 4, 1]]), new Matrix([[2, 2, 3]]))).toBe(15);
            expect(MatrixMath.dot(new Matrix([[2, 4, 1]]), new Matrix([[2], [2], [3]]))).toBe(15);
            expect(MatrixMath.dot(new Matrix([[2], [4], [1]]), new Matrix([[2, 2, 3]]))).toBe(15);
        });

        //  test('vectors and matrix', function () {
        //     expect(MatrixMath.dot(new Matrix([[1, 2]]), new Matrix([[1, 2], [3, 4], [5, 6]]))).toBe(15);
        // });
    });

    describe('multiply method', function () {

         test('matrix multiply by number', function () {
            const mat1 = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
            const mat2 = MatrixMath.multiply(mat1, 2);

            expect(mat2.getData()).toEqual([[2, 2, 2], [2, 2, 2], [2, 2, 2]]);
        });

        describe('multiply 2 matrices', function () {
             test('with square matrices', function () {
                const mat1 = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
                const mat2 = new Matrix([[1, 2, 3], [3, 2, 1], [2, 2, 2]]);
                const mat3 = MatrixMath.multiply(mat1, mat2);

                expect(mat3.getData()).toEqual([[6, 6, 6], [6, 6, 6], [6, 6, 6]]);
            });

             test('with different size matrices', function () {
                const mat1 = new Matrix([[1, 1], [1, 1], [1, 1]]);
                const mat2 = new Matrix([[1, 2, 3], [3, 2, 1]]);

                expect(MatrixMath.multiply(mat2, mat1).getData()).toEqual([[6, 6], [6, 6]]);
                expect(MatrixMath.multiply(mat1, mat2).getData()).toEqual([[4, 4, 4], [4, 4, 4], [4, 4, 4]]);
            });

             test('invalid matrices sizes', function () {
                const mat1 = new Matrix([[1, 1], [1, 1], [1, 1]]);
                const mat2 = new Matrix([[1, 2, 3], [3, 2, 1], [2, 2, 2]]);

                expect(()=>MatrixMath.multiply(mat1, mat2)).toThrow();
            });
        });
    });

    describe('transpose method', function () {
         test('with square matrices', function () {
            const mat1 = new Matrix([[1, 2, 3], [3, 2, 1], [2, 2, 2]]);

            expect(MatrixMath.transpose(mat1).getData()).toEqual([[1, 3, 2], [2, 2, 2], [3, 1, 2]]);
        });

         test('with non square matrices', function () {
            const mat1 = new Matrix([[1, 2, 3], [3, 2, 1]]);
            const mat2 = new Matrix([[1, 2], [3, 2], [2, 2]]);

            expect(MatrixMath.transpose(mat1).getData()).toEqual([[1, 3], [2, 2], [3, 1]]);
            expect(MatrixMath.transpose(mat2).getData()).toEqual([[1, 3, 2], [2, 2, 2]]);
        });
    });

    describe('identity method', function () {
         test('with 0 size', function () {
            expect(()=>MatrixMath.identity(0)).toThrow();
        });

         test('with size greater than 0', function () {
            expect(MatrixMath.identity(1).getData()).toEqual([[1]]);
            expect(MatrixMath.identity(2).getData()).toEqual([[1, 0], [0, 1]]);
            expect(MatrixMath.identity(3).getData()).toEqual([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        });
    });
});