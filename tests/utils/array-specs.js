describe('ArrayUtils', function () {
    const ArrayUtils = require(__UTILS + 'array');

    beforeEach(function () {
    });

    describe('arrayCopy method', function () {
        it('', function () {
            let arr1 = [1, 2];
            let arr2 = [0, 0, 0, 0, 0, 0, 0, 0];
            ArrayUtils.arrayCopy(arr1, 0, arr2, 5, 2);

            expect(arr2).toEqual([0, 0, 0, 0, 0, 1, 2, 0]);
        });
    });
});