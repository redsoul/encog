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
     * @param biasActivation {Number} Bias activation
     */
    setBias(biasActivation) {}

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

    /**
     * Connect the actual layer with the target layer
     *
     * @param target {FreeformLayer} The target layer.
     * @param theActivationFunction {ActivationFunction} The activation function to use.
     * @param biasActivation {Number} The bias activation to use.
     * @param connectionType {FreeformConnection} The bias activation to use.
     */
    connectWith(target, theActivationFunction, biasActivation,connectionType){}
}

module.exports = FreeformLayer;