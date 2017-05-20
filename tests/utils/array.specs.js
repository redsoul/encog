describe('ArrayUtils', function () {
    const ArrayUtils = require(PATHS.UTILS + 'array');

    beforeEach(function () {
    });

    describe('arrayCopy method', function () {
        let arr1;
        let arr2;

        beforeEach(function () {
            arr1 = [1, 2, 3];
            arr2 = [0, 0, 0, 0, 0, 0, 0, 0];
        });

        it('2 arguments', function () {
            ArrayUtils.arrayCopy(arr1, arr2);
            expect(arr2).toEqual([1, 2, 3, 0, 0, 0, 0, 0]);
        });

        describe('5 arguments', function () {
            it('positive length', function () {
                ArrayUtils.arrayCopy(arr1, 0, arr2, 4, 2);
                expect(arr2).toEqual([0, 0, 0, 0, 1, 2, 0, 0]);
            });

            it('zero length', function () {
                ArrayUtils.arrayCopy(arr1, 0, arr2, 4, 0);
                expect(arr2).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
            });

            it('negative length', function () {
                ArrayUtils.arrayCopy(arr1, 0, arr2, 4, -2);
                expect(arr2).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
            });

            it('negative sourcePos', function () {
                ArrayUtils.arrayCopy(arr1, -1, arr2, 4, 2);
                expect(arr2).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
            });

            it('negative targetPos', function () {
                ArrayUtils.arrayCopy(arr1, -1, arr2, 4, 2);
                expect(arr2).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
            });
        });
    });

    describe('fillArray method', function () {
        let arr;
        beforeEach(function () {
            arr = [0, 0, 0, 0, 0, 0];
        });

        it('2 arguments', function () {
            ArrayUtils.fillArray(arr, 1);
            expect(arr).toEqual([1, 1, 1, 1, 1, 1]);
        });

        describe('4 arguments', function () {
            it('positive start and stop', function () {
                ArrayUtils.fillArray(arr, 2, 4, 1);
                expect(arr).toEqual([0, 0, 1, 1, 0, 0]);
            });

            it('stop smaller than start', function () {
                ArrayUtils.fillArray(arr, 2, 1, 1);
                expect(arr).toEqual([0, 0, 0, 0, 0, 0]);
            });

            it('positive start and negative stop', function () {
                ArrayUtils.fillArray(arr, 2, -1, 1);
                expect(arr).toEqual([0, 0, 1, 1, 1, 0]);
            });

            it('negative start and positive stop', function () {
                ArrayUtils.fillArray(arr, -2, 3, 1);
                expect(arr).toEqual([0, 0, 0, 0, 0, 0]);
            });
        });
    });

    describe('newIntArray method', function () {
        it('', function () {
            expect(ArrayUtils.newIntArray(2)).toEqual([0, 0]);
            expect(ArrayUtils.newIntArray(2, 1)).toEqual([1, 1]);
        })
    });

    describe('newFloatArray method', function () {
        it('', function () {
            expect(ArrayUtils.newFloatArray(2)).toEqual([0.0, 0.0]);
            expect(ArrayUtils.newFloatArray(2, 1.0)).toEqual([1.0, 1.0]);
        })
    });

    it('toStringAsMatrix method', function () {
        expect(ArrayUtils.toStringAsMatrix([1, 2, 3, 4, 5, 6], 2)).toBe('1,2\n3,4\n5,6');
        expect(ArrayUtils.toStringAsMatrix([1, 2, 3, 4, 5, 6], 3)).toBe('1,2,3\n4,5,6');
    })
});