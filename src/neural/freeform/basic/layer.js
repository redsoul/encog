const FreeformLayer = require(PATHS.FREEFORM + 'interfaces/layer');
const BasicFreeformNeuron = require(PATHS.FREEFORM + 'basic/neuron');
const BasicActivationSummation = require(PATHS.FREEFORM + 'basic/activationSummation');
const BasicFreeformConnection = require(PATHS.FREEFORM + 'basic/connection');
const ActivationTanh = require(PATHS.ACTIVATION_FUNCTIONS + 'tanh');
var cuid = require('cuid');

/**
 * Implements a basic freeform layer.
 *
 */
class BasicFreeformLayer extends FreeformLayer {

    constructor(layerName) {
        super();
        /**
         * The neurons in this layer.
         */
        this.neurons = [];
        this.name = layerName;
        this.id = cuid();
    }


    /**
     * @inheritDoc
     */
    add(neuron) {
        neuron.layerName = this.name;
        neuron.layer = this;
        neuron.name = neuron.isBias() ? 'Bias Neuron' : 'Neuron ' + this.neurons.length;
        this.neurons.push(neuron);
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

    isGate() {
        return false;
    }

    /**
     * @inheritDoc
     */
    connectWith(target, theActivationFunction = new ActivationTanh(), biasActivation = 1.0, connectionType = BasicFreeformConnection) {
        // create bias, if requested
        if (biasActivation > PATHS.CONSTANTS.DEFAULT_DOUBLE_EQUAL && !this.hasBias()) {
            const biasNeuron = new BasicFreeformNeuron(null);
            biasNeuron.setActivation(biasActivation);
            biasNeuron.setBias(true);
            this.add(biasNeuron);
        }

        // create connections
        for (let targetNeuron of target.getNeurons()) {
            // create the summation for the target
            let summation = targetNeuron.getInputSummation();

            // do not create a second input summation
            if (summation == null) {
                summation = new BasicActivationSummation(theActivationFunction);
                targetNeuron.setInputSummation(summation);
            }

            // connect the source neurons to the target neuron
            for (let sourceNeuron of this.getNeurons()) {
                const connection = new connectionType(sourceNeuron, targetNeuron);
                sourceNeuron.addOutput(connection);
                targetNeuron.addInput(connection);
            }
        }
    }
}

module.exports = BasicFreeformLayer;