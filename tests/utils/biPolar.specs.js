describe('BiPolarUtils', function () {
    const Encog = require(PATHS.BASE);
    Encog.Log.options.logLevel = 'silent';

    const BiPolarUtils = Encog.Utils.BiPolar;
    const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');

    beforeEach(function () {
    });

    describe('bipolar2double method', function () {
         test('undefined parameter', function () {
            expect(()=>BiPolarUtils.bipolar2double()).toThrow(new NeuralNetworkError('bipolar2double undefined argument'))
        });

         test('Boolean parameter', function () {
            expect(BiPolarUtils.bipolar2double(true)).toBe(1);
            expect(BiPolarUtils.bipolar2double(false)).toBe(-1);
        });

         test('Array parameter', function () {
            expect(BiPolarUtils.bipolar2double([true, false])).toEqual([1, -1]);
            expect(BiPolarUtils.bipolar2double([false, true])).toEqual([-1, 1]);
        });

         test('Matrix parameter', function () {
            expect(BiPolarUtils.bipolar2double([[true, false], [true, false]])).toEqual([[1, -1], [1, -1]]);
            expect(BiPolarUtils.bipolar2double([[false, true], [false, true]])).toEqual([[-1, 1], [-1, 1]]);
        })
    });

    describe('bipolar2binary method', function () {
         test('undefined parameter', function () {
            expect(()=>BiPolarUtils.bipolar2binary()).toThrow(new NeuralNetworkError('bipolar2binary undefined argument'))
        });

         test('Boolean parameter', function () {
            expect(BiPolarUtils.bipolar2binary(1)).toBe(1);
            expect(BiPolarUtils.bipolar2binary(-1)).toBe(0);
        });

         test('Array parameter', function () {
            expect(BiPolarUtils.bipolar2binary([1, -1])).toEqual([1, 0]);
            expect(BiPolarUtils.bipolar2binary([-1, 1])).toEqual([0, 1]);
        });

         test('Matrix parameter', function () {
            expect(BiPolarUtils.bipolar2binary([[1, -1], [1, -1]])).toEqual([[1, 0], [1, 0]]);
            expect(BiPolarUtils.bipolar2binary([[-1, 1], [-1, 1]])).toEqual([[0, 1], [0, 1]]);
        })
    });

    describe('double2bipolar method', function () {
         test('Numeric parameter', function () {
            expect(BiPolarUtils.double2bipolar(1)).toBe(true);
            expect(BiPolarUtils.double2bipolar(-1)).toBe(false);
        });

         test('Array parameter', function () {
            expect(BiPolarUtils.double2bipolar([1, -1])).toEqual([true, false]);
            expect(BiPolarUtils.double2bipolar([-1, 1])).toEqual([false, true]);
        });

         test('Matrix parameter', function () {
            expect(BiPolarUtils.double2bipolar([[1, -1], [1, -1]])).toEqual([[true, false], [true, false]]);
            expect(BiPolarUtils.double2bipolar([[-1, 1], [-1, 1]])).toEqual([[false, true], [false, true]]);
        })
    });

     test('normalizeBinary method', function () {
        expect(BiPolarUtils.normalizeBinary(1)).toBe(1);
        expect(BiPolarUtils.normalizeBinary(-1)).toBe(0);
        expect(BiPolarUtils.normalizeBinary(5)).toBe(1);
        expect(BiPolarUtils.normalizeBinary(0)).toBe(0);
        expect(BiPolarUtils.normalizeBinary(-10)).toBe(0);
    });

     test('toBinary method', function () {
        expect(BiPolarUtils.toBinary(1)).toBe(1);
        expect(BiPolarUtils.toBinary(-1)).toBe(0);
    });

     test('toBiPolar method', function () {
        expect(BiPolarUtils.toBiPolar(1)).toBe(1);
        expect(BiPolarUtils.toBiPolar(20)).toBe(1);
        expect(BiPolarUtils.toBiPolar(0)).toBe(-1);
        expect(BiPolarUtils.toBiPolar(-5)).toBe(-1);
    });

     test('toNormalizedBinary method', function () {
        expect(BiPolarUtils.toNormalizedBinary(1)).toBe(1);
        expect(BiPolarUtils.toNormalizedBinary(20)).toBe(1);
        expect(BiPolarUtils.toNormalizedBinary(0)).toBe(1);
        expect(BiPolarUtils.toNormalizedBinary(-5)).toBe(0);
    })

});