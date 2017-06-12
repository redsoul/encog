const BasicFreeformLayer = require(PATHS.FREEFORM + 'basic/layer');

/**
 * Implements a basic freeform layer.
 *
 */
class Gate extends BasicFreeformLayer {

    constructor(layerName) {
        super(layerName);
    }

    isGate() {
        return true;
    }
}

module.exports = Gate;