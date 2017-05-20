const ArrayUtils = require(PATHS.UTILS + 'array');
const BiPolarNeuralData = require(PATHS.NEURAL + 'biPolarNeuralData');
const NeuralNetworkError = require(PATHS.ERROR_HANDLING + 'neuralNetwork');
/**
 * The thermal network forms the base class for Hopfield and Boltzmann machines.
 * @author jheaton
 *
 */
class ThermalNetwork {
    /**
     * Construct the network with the specicified neuron count.
     * @param neuronCount The number of neurons.
     */
    constructor(neuronCount) {
        /**
         * The neuron count.
         */
        this.neuronCount = neuronCount;
        /**
         * The weights.
         */
        this.weights = ArrayUtils.newBooleanArray(neuronCount * neuronCount);
        /**
         * The current state of the thermal network.
         */
        this.currentState = new BiPolarNeuralData(neuronCount);
    }

    /**
     * Add to the specified weight.
     * @param fromNeuron {Number} The from neuron.
     * @param toNeuron {Number}The to neuron.
     * @param value {Number}The value to add.
     */
    addWeight(fromNeuron, toNeuron, value) {
        const index = (toNeuron * this.neuronCount) + fromNeuron;
        if (index >= this.weights.length) {
            throw new NeuralNetworkError("Out of range: fromNeuron:" + fromNeuron + ", toNeuron: " + toNeuron);
        }
        this.weights[index] += value;
    }

    /**
     * Calculate the current energy for the network. The network will seek to lower this value.
     *
     * @return {Number}
     */
    calculateEnergy() {
        let tempE = 0;
        const neuronCount = this.getNeuronCount();

        for (let i = 0; i < neuronCount; i++) {
            for (let j = 0; j < neuronCount; j++) {
                if (i != j) {
                    tempE += this.getWeight(i, j) * this.currentState.getData(i) * this.currentState.getData(j);
                }
            }
        }
        return -1 * tempE / 2;
    }

    /**
     * Clear any connection weights.
     */
    clear() {
        ArrayUtils.fillArray(this.weights, 0);
    }

    /**
     * @return {BiPolarNeuralData} The current state of the network.
     */
    getCurrentState() {
        return this.currentState;
    }

    /**
     * @return {Number} Get the neuron count for the network.
     */
    getNeuronCount() {
        return this.neuronCount;
    }

    /**
     * Get a weight.
     * @param fromNeuron {Number} The from neuron.
     * @param toNeuron {Number}The to neuron.
     * @return {Number} The weight.
     */
    getWeight(fromNeuron, toNeuron) {
        const index = (toNeuron * this.neuronCount) + fromNeuron;
        return this.weights[index];
    }

    /**
     * @return {Array} The weights.
     */
    getWeights() {
        return this.weights;
    }

    /**
     * Init the network.
     * @param neuronCount {Number}The neuron count.
     * @param weights {Array} The weights.
     * @param output {Array} The output
     */
    init(neuronCount, weights, output) {
        if (neuronCount != output.length) {
            throw new NeuralNetworkError("Neuron count(" + neuronCount + ") must match output count(" + output.length + ").");
        }

        if ((neuronCount * neuronCount) != weights.length) {
            throw new NeuralNetworkError("Weight count(" + weights.length
                + ") must be the square of the neuron count(" + neuronCount
                + ").");
        }

        this.neuronCount = neuronCount;
        this.weights = weights;
        this.currentState = new BiPolarNeuralData(neuronCount);
        this.currentState.setData(output);
    }

    /**
     * reset the network.
     */
    reset() {
        this.getCurrentState().clear();
        ArrayUtils.fillArray(this.weights, 0.0);
    }

    /**
     * @param state {BiPolarNeuralData}
     *            The current state for the network.
     */
    setCurrentState(state) {
        if (state.constructor.name = 'BiPolarNeuralData') {
            for (let i = 0; i < state.size(); i++) {
                this.currentState.setData(i, state.getData(i));
            }
        } else {
            this.currentState = new BiPolarNeuralData(state.length);
            ArrayUtils.arrayCopy(state, this.currentState.getData());
        }
    }

    /**
     * Set the neuron count.
     * @param c {Number} The neuron count.
     */
    setNeuronCount(c) {
        this.neuronCount = c;

    }

    /**
     * Set the weight.
     * @param fromNeuron {Number} The from neuron.
     * @param toNeuron {Number} The to neuron.
     * @param value {Number} The value.
     */
    setWeight(fromNeuron, toNeuron, value) {
        const index = (toNeuron * this.neuronCount) + fromNeuron;
        this.weights[index] = value;
    }

    /**
     * Set the weight array.
     * @param w {Array} The weight array.
     */
    setWeights(w) {
        this.weights = w;
    }
}

module.exports = ThermalNetwork;