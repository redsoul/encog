describe('MinMaxScaller encoder', function () {
    const MinMaxScaller = require(PATHS.DATA_MAPPERS + 'minMaxScaller');
    const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
    let minMaxScaller;

    beforeEach(function () {
        minMaxScaller = new MinMaxScaller();
    });

    describe('fit_transform', function () {
        let values1 = [2, 6, -1, 2];
        let values2 = [-3, 4, 2, 7];

        it('should return a normalized array, using the default parameters', function () {
            expect(minMaxScaller.fit_transform(values1, ''))
                .toEqual({columns: [''], values: [-0.14285714, 1, -1, -0.14285714]});
            expect(minMaxScaller.fit_transform(values2, ''))
                .toEqual({columns: [''], values: [-1, 0.4, 0, 1]});
        });

        it('should return a normalized array, using a customized range', function () {
            expect(minMaxScaller.fit_transform(values1, '', 0, 5))
                .toEqual({columns: [''], values: [2.14285714, 5, 0, 2.14285714]});
            expect(minMaxScaller.fit_transform(values2, '', 0, 5))
                .toEqual({columns: [''], values: [0, 3.5, 2.5, 5]});
        });
    });

    describe('calcMinMaxValues', function () {
        it('should return an object with min and max values', function () {
            expect(MinMaxScaller.calcMinMaxValues([2, 5, -1, 2])).toEqual({max: 5, min: -1});
            expect(MinMaxScaller.calcMinMaxValues([-3, 4, 2, 4])).toEqual({max: 4, min: -3});
        });
    });

    describe('featureScalling', function () {
        it('should throw an exception', function () {
            expect(()=> {
                MinMaxScaller.featureScaling(5, 4, 3)
            }).toThrow(new NeuralNetworkError('Min value should be smaller than Max value'));
        });

        it('should throw an exception', function () {
            expect(()=> {
                MinMaxScaller.featureScaling(5, 2, 3, 1, 0)
            }).toThrow(new NeuralNetworkError('Min range should be smaller than Max range'));
        });

        it('should return a normalized value, using the default parameters', function () {
            expect(MinMaxScaller.featureScaling(0, 0, 100)).toBe(-1);
            expect(MinMaxScaller.featureScaling(50, 0, 100)).toBe(0);
            expect(MinMaxScaller.featureScaling(100, 0, 100)).toBe(1);
            expect(MinMaxScaller.featureScaling(25, 0, 100)).toBe(-0.5);
            expect(MinMaxScaller.featureScaling(75, 0, 100)).toBe(0.5);
            expect(MinMaxScaller.featureScaling(150, 0, 100)).toBe(2);
        });

        it('should return a normalized value, using a customized range', function () {
            expect(MinMaxScaller.featureScaling(0, 0, 100, 0, 5)).toBe(0);
            expect(MinMaxScaller.featureScaling(50, 0, 100, 0, 5)).toBe(2.5);
            expect(MinMaxScaller.featureScaling(100, 0, 100, 0, 5)).toBe(5);
            expect(MinMaxScaller.featureScaling(25, 0, 100, 0, 5)).toBe(1.25);
            expect(MinMaxScaller.featureScaling(75, 0, 100, 0, 5)).toBe(3.75);
            expect(MinMaxScaller.featureScaling(150, 0, 100, 0, 5)).toBe(7.5);
        });
    });
});