describe('ArrayUtils', function () {
    const ArrayUtils = require(PATHS.UTILS + 'array');

    beforeEach(function () {
    });

    it('arrayCopy method', function () {
        let arr1 = [1, 2];
        let arr2 = [0, 0, 0, 0, 0, 0, 0, 0];
        ArrayUtils.arrayCopy(arr1, 0, arr2, 5, 2);

        expect(arr2).toEqual([0, 0, 0, 0, 0, 1, 2, 0]);
    });
});