const FreeformLayer = require(PATHS.FREEFORM + 'interfaces/layer');
const BasicFreeformNeuron = require(PATHS.FREEFORM + 'basic/neuron');

/**
 * Implements a basic freeform layer.
 *
 */
class BasicFreeformLayer extends FreeformLayer {

    constructor() {
        super();
        /**
         * The neurons in this layer.
         */
        this.neurons = [];
    }


    /**
     * @inheritDoc
     */
    add(basicFreeformNeuron) {
        this.neurons.push(basicFreeformNeuron);
    }

    /**
     * @inheritDoc
     */
    getNeurons() {
        return this.neurons;
    }

    /**
     * @inheritDoc
     */
    hasBias() {
        for (let neuron of this.neurons) {
            if (neuron.isBias()) {
                return true;
            }
        }
        return false;
    }

    /**
     * @inheritDoc
     */
    setBias(biasActivation) {
        if (!this.hasBias()) {
            const biasNeuron = new BasicFreeformNeuron(null);
            biasNeuron.setActivation(biasActivation);
            biasNeuron.setBias(true);
            this.add(biasNeuron);
        }
    }

    /**
     * @inheritDoc
     */
    setActivation(i, activation) {
        this.neurons[i].setActivation(activation);
    }

    /**
     * @inheritDoc
     */
    size() {
        return this.neurons.length;
    }

    /**
     * @inheritDoc
     */
    sizeNonBias() {
        let result = 0;
        for (let neuron of this.neurons) {
            if (!neuron.isBias()) {
                result++;
            }
        }
        return result;
    }
}

module.exports = BasicFreeformLayer;