/**
 * Used to configure a flat layer. Flat layers are not kept by a Flat Network,
 * beyond setup.
 */
class FlatLayer {
    /**
     * Construct a flat layer.
     *
     * @param activation {ActivationFunction}
     *            The activation function.
     * @param count {Number}
     *            The neuron count.
     * @param biasActivation {Number}
     *            The bias activation.
     * @param dropoutRate {Number}
     *              The dropout rate for this layer
     */
    constructor(activation, count, biasActivation = 0, dropoutRate = 0) {
        this.activation = activation;
        this.count = count;
        this.biasActivation = biasActivation;
        this.contextFedBy = null;
        this.dropoutRate = dropoutRate;
    }

    /**
     * @return {boolean} the bias
     */
    hasBias() {
        return Math.abs(this.biasActivation) > PATHS.CONSTANTS.DEFAULT_DOUBLE_EQUAL;
    }

    /**
     * @return {number} the count
     */
    getCount() {
        return this.count;
    }

    getNeuronCount() {
        return this.getCount();
    }

    /**
     * @return {number} The total number of neurons on this layer, includes context, bias and regular.
     */
    getTotalCount() {
        if (this.contextFedBy === null) {
            return this.getCount() + (this.hasBias() ? 1 : 0);
        } else {
            return this.getCount() + (this.hasBias() ? 1 : 0) + this.contextFedBy.getCount();
        }
    }

    /**
     * @return {number} The number of neurons our context is fed by.
     */
    getContextCount() {
        if (this.contextFedBy == null) {
            return 0;
        } else {
            return this.contextFedBy.getCount();
        }
    }

    /**
     * @return {Number} Get the bias activation.
     */
    getBiasActivation() {
        if (this.hasBias()) {
            return this.biasActivation;
        } else {
            return 0;
        }
    }

    /**
     * @return {String}
     */
    toString() {
        let result = "[";
        result += this.constructor.name;
        result += ": count=" + this.count;
        result += ",bias=";

        if (hasBias()) {
            result += this.biasActivation;
        } else {
            result += "false";
        }
        if (this.contextFedBy != null) {
            result += ",contextFed=";
            if (this.contextFedBy == this) {
                result += "itself";
            } else {
                result += this.contextFedBy;
            }
        }
        result += "]";
        return result;
    }
}

module.exports = FlatLayer;