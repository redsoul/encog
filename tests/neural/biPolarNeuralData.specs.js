describe('BiPolarNeuralData', function () {
    const BiPolarNeuralData = require(PATHS.NEURAL + 'biPolarNeuralData');
    const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');

    beforeEach(function () {
    });

    describe('constructor', function () {
         it('Numeric parameter', function () {
            const obj = new BiPolarNeuralData(3);
            expect(obj.data).toEqual([false, false, false]);
        });

         it('Array parameter', function () {
            const obj = new BiPolarNeuralData([false, true, false, true]);
            expect(obj.data).toEqual([false, true, false, true]);
        });
    });

    describe('methods', function () {
        let obj;
        beforeEach(function () {
            obj = new BiPolarNeuralData([false, true, false, true]);
        });

         it('clear method', function () {
            obj.clear();
            expect(obj.data).toEqual([false, false, false, false]);
        });

         it('clone method', function () {
            const obj2 = obj.clone();
            expect(obj.data).toEqual(obj2.data);
        });

         it('getBoolean method', function () {
            expect(obj.getBoolean(0)).toBe(false);
            expect(obj.getBoolean(1)).toBe(true);
            expect(obj.getBoolean(2)).toBe(false);
            expect(obj.getBoolean(3)).toBe(true);
            expect(obj.getBoolean(4)).toBe(undefined);
        });

         it('getData method', function () {
            expect(obj.getData()).toEqual([-1, 1, -1, 1]);
            expect(obj.getData(0)).toBe(-1);
            expect(obj.getData(1)).toBe(1);
            expect(obj.getData(2)).toBe(-1);
            expect(obj.getData(3)).toBe(1);
            expect(()=>obj.getData(4)).toThrow(new NeuralNetworkError('bipolar2double undefined argument'));
        });

        describe('setData method', function () {
             it('1 argument', function () {
                obj.setData([1, -1, -1, 1]);
                expect(obj.data).toEqual([true, false, false, true]);
            });

             it('2 arguments', function () {
                obj.setData(0, false);
                expect(obj.getData(0)).toEqual(-1);
                obj.setData(0, true);
                expect(obj.getData(0)).toEqual(1);

                obj.setData(1, 1);
                expect(obj.getData(1)).toEqual(1);
                obj.setData(1, -1);
                expect(obj.getData(1)).toEqual(-1);
            });
        });

         it('size method', function () {
            expect(obj.size()).toBe(4);
        });
    })
});