/**
 * Defines a freeform layer. A layer is a group of similar neurons.
 *
 */
class FreeformLayer {

    /**
     * Add a neuron to this layer.
     * @param basicFreeformNeuron {FreeformNeuron} The neuron to add.
     */
    add(basicFreeformNeuron){}

    /**
     * @return {Array} The neurons in this layer.
     */
    getNeurons(){}

    /**
     * @return {Boolean} True if this layer has bias.
     */
    hasBias(){}

    /**
     * Set the activation for the specified index.
     * @param i {Number} The index.
     * @param data {Number} The data for that index.
     */
    setActivation(i, data){}

    /**
     * @return {Number} The size of this layer, including bias.
     */
    size(){}

    /**
     * @return {Number} The size of this layer, no bias counted.
     */
    sizeNonBias(){}
}

module.exports = FreeformLayer;