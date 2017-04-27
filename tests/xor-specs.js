fdescribe('XOR', function () {
    'use strict';

    let XOR_INPUT;
    let XOR_IDEAL;
    const BasicNetwork = require(__NETWORKS + 'basic');
    const BasicLayer = require(__LAYERS + 'basic');
    const ActivationSigmoid = require(__ACTIVACTION_FUNCTIONS + 'sigmoid');
    const BackPropagation = require(__TRAINERS + 'back');

    beforeEach(function () {
        /**
         * The input necessary for XOR.
         */
        XOR_INPUT = [[0.0, 0.0], [1.0, 0.0],
            [0.0, 1.0], [1.0, 1.0]];

        /**
         * The ideal data necessary for XOR.
         */
        XOR_IDEAL = [[0.0], [1.0], [1.0], [0.0]];
    });

    describe('', function () {
        it('', function () {


            // create a neural network, without using a factory
            const network = new BasicNetwork();
            network.addLayer(new BasicLayer(null, true, 2));
            network.addLayer(new BasicLayer(new ActivationSigmoid(), true, 3));
            network.addLayer(new BasicLayer(new ActivationSigmoid(), false, 1));
            network.structure.finalizeStructure();
            network.reset();

            // train the neural network
            const train = new BackPropagation(network, XOR_INPUT, XOR_IDEAL);

            let epoch = 1;

            do {
                train.iteration();
                console.log("Epoch #" + epoch + " Error:" + train.error);
                epoch++;
            } while (train.error > 0.01);
            // } while (epoch < 10);
            train.finishTraining();

            // test the neural network
            console.log("Neural Network Results:");
            let i = 0;
            for (let input of XOR_INPUT) {
                const output = network.compute(input);
                console.log(input[0] + "," + input[1]
                    + ", actual=" + output[0] + ",ideal=" + XOR_IDEAL[i]);
                i++;
            }
        });
    });
});