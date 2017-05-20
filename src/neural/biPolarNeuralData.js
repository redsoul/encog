const ArrayUtils = require(PATHS.UTILS + 'array');
const BiPolarUtil = require(PATHS.UTILS + 'biPolar');
/**
 * A NeuralData implementation designed to work with bipolar data.
 * Bipolar data contains two values. True is stored as 1, and false is stored as -1.
 *
 * @author jheaton
 *
 */
class BiPolarNeuralData {

    constructor() {
        if (arguments[0].constructor.name == 'Number') {
            this.data = ArrayUtils.newBooleanArray(arguments[0]);
        } else if (arguments[0].constructor.name == 'Array') {
            this.data = ArrayUtils.newBooleanArray(arguments[0].length);
            ArrayUtils.arrayCopy(arguments[0], 0, this.data, 0, arguments[0].length)
        }
    }


    /**
     * Set all data to false.
     */
    clear() {
        this.data = ArrayUtils.newBooleanArray(this.data.length);
    }

    /**
     * @return {BiPolarNeuralData} A cloned copy of this object.
     */
    clone() {
        const result = new BiPolarNeuralData(this.size());
        for (let i = 0; i < this.size(); i++) {
            result.setData(i, this.getData(i));
        }
        return result;
    }

    /**
     * Get the specified data item as a boolean.
     *
     * @param i {Number} - The index to read.
     * @return {Boolean} The specified data item's value.
     */
    getBoolean(i) {
        return this.data[i];
    }

    /**
     * Get the data held by the index.
     *
     * @param index The index to read.
     * @return {Array || Number} Return the data held at the specified index.
     */
    getData(index = null) {
        if (index !== null && index.constructor.name == 'Number') {
            return BiPolarUtil.bipolar2double(this.data[index]);
        }
        return BiPolarUtil.bipolar2double(this.data);
    }

    /**
     * Store the array.
     *
     * @param index {Number} The index to set OR The data to store.
     * @param value {Boolean} The value to set.
     */
    setData(index, value) {
        if (arguments.length == 1) {
            this.data = BiPolarUtil.double2bipolar(arguments[0]);
        } else if (arguments.length == 2) {
            switch (value.constructor.name) {
                case 'Boolean':
                    this.data[index] = value;
                    break;
                case 'Number':
                    this.data[index] = BiPolarUtil.double2bipolar(value);
                    break;
            }
        }
    }


    /**
     * Get the size of this data object.
     *
     * @return {Number} The size of this data object.
     */
    size() {
        return this.data.length;
    }

    /**
     * @returns {String}
     */
    toString() {
        let result = '[';
        for (let i = 0; i < this.size(); i++) {
            if (this.getData(i) > 0) {
                result += "T";
            } else {
                result += "F";
            }

            if (i != this.size() - 1) {
                result += ",";
            }
        }
        return result + ']';
    }
}

module.exports = BiPolarNeuralData;