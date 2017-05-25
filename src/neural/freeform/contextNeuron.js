const BasicFreeformNeuron = require(PATHS.FREEFORM + 'basic/neuron');
/**
 * Defines a freeform context neuron.
 *
 */
class FreeformContextNeuron extends BasicFreeformNeuron {


    /**
     * Construct the context neuron.
     * @param theContextSource {FreeformNeuron} The context source.
     */
    constructor(theContextSource) {
        super(null);
        this.contextSource = theContextSource;
    }

    /**
     * @return {FreeformNeuron} the contextSource
     */
    getContextSource() {
        return this.contextSource;
    }

    /**
     * @param contextSource {FreeformNeuron} the contextSource to set
     */
    setContextSource(contextSource) {
        this.contextSource = contextSource;
    }

    /**
     * {@inheritDoc}
     */
    updateContext() {
        this.setActivation(this.contextSource.getActivation());
    }
}

module.exports = FreeformContextNeuron;