describe('DataEncoder', function () {
    const _ = require('lodash');
    const DataEncoder = require(PATHS.PREPROCESSING + 'dataEncoder');
    const OneHot = require(PATHS.DATA_MAPPERS + 'oneHot');
    const MinMaxScaller = require(PATHS.DATA_MAPPERS + 'minMaxScaller');
    const CustomBuckets = require(PATHS.DATA_MAPPERS + 'customBuckets');
    const EqualLengthBuckets = require(PATHS.DATA_MAPPERS + 'equalLengthBuckets');
    const LinearBuckets = require(PATHS.DATA_MAPPERS + 'linearBuckets');

    beforeEach(function () {

    });

    describe('one hot encode/decode', function () {

        beforeEach(function () {
        });

        it('should encode into a one hot array', function () {
            const trainData = [
                {col1: 'a', col2: 1, col3: 0, col4: 0, col5: 1, col6: 1, col7: 1},
                {col1: 'b', col2: 2, col3: 2, col4: 5, col5: 2, col6: 2, col7: 2},
                {col1: 'c', col2: 3, col3: 3, col4: 8, col5: 3, col6: 3, col7: 3},
                {col1: 'a', col2: 2, col3: 1, col4: 15, col5: 5, col6: 5, col7: 5}
            ];
            const testData = [
                {col1: 'c', col2: 1, col3: 4, col4: -3, col5: 4, col6: 4, col7: 4},
                {col1: 'b', col2: 3, col3: 2, col4: 16, col5: 6, col6: 6, col7: 6},
            ];
            const mapping = {
                'col1': new OneHot(),
                'col3': new OneHot(),
                'col4': new MinMaxScaller(),
                'col5': new CustomBuckets([2, 4]),
                'col6': new EqualLengthBuckets(2),
                'col7': new LinearBuckets(2)
            };
            const dataEncoder = new DataEncoder();
            const encodedTrainData = dataEncoder.fit_transform(trainData, mapping);

            expect(encodedTrainData.values.length).toEqual(trainData.length);
            expect(encodedTrainData.columns).toEqual(
                ['col1_a', 'col1_b', 'col1_c', 'col3_0', 'col3_2', 'col3_3', 'col3_1', 'col4', 'col5', 'col6', 'col7', 'col2']
            );
            expect(encodedTrainData.values[0]).toEqual([1, 0, 0, 1, 0, 0, 0, -1, 0, 0, 0, 1]);
            expect(encodedTrainData.values[1]).toEqual([0, 1, 0, 0, 1, 0, 0, -0.33333333, 1, 1, 1, 2]);
            expect(encodedTrainData.values[2]).toEqual([0, 0, 1, 0, 0, 1, 0, 0.06666667, 1, 1, 1, 3]);
            expect(encodedTrainData.values[3]).toEqual([1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2]);

            const encodedTestData = dataEncoder.transform(testData, mapping);
            expect(encodedTestData.values.length).toEqual(testData.length);
            expect(encodedTestData.columns).toEqual(
                ['col1_a', 'col1_b', 'col1_c', 'col3_0', 'col3_2', 'col3_3', 'col3_1', 'col4', 'col5', 'col6', 'col7', 'col2']
            );
            expect(encodedTestData.values[0]).toEqual([0, 0, 1, 0, 0, 0, 0, -1.4, 2, 1, 1, 1]);
            expect(encodedTestData.values[1]).toEqual([0, 1, 0, 0, 1, 0, 0, 1.13333333, 2, 2, 2, 3]);
        });
    });
});