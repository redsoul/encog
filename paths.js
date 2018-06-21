module.exports = (function () {
    const BASE = __dirname;
    const EXAMPLES = BASE + '/examples/';
    const DATA_FOLDER = EXAMPLES + '/data/';
    const SRC = BASE + '/src/';
    const CONSTANTS = require(SRC + 'constants.js');
    const ACTIVATION_FUNCTIONS = SRC + 'activation/functions/';
    const ERROR_FUNCTIONS = SRC + 'neural/error/functions/';
    const LAYERS = SRC + 'neural/layers/';
    const SCORE = SRC + 'neural/scores/';
    const NETWORKS = SRC + 'neural/networks/';
    const NEURAL = SRC + 'neural/';
    const FREEFORM = NEURAL + 'freeform/';
    const FREEFORM_PROPAGATION = FREEFORM + 'training/propagation/';
    const PATTERNS = SRC + 'patterns/';
    const TRAINING = SRC + 'neural/training/';
    const PROPAGATION = TRAINING + 'propagation/';
    const SGD = TRAINING + 'sgd/';
    const STRATEGIES = TRAINING + 'strategy/';
    const MATH_UTILS = SRC + 'mathUtils/';
    const MATRICES = SRC + 'mathUtils/matrices/';
    const HESSIAN = MATH_UTILS + 'matrices/hessian/';
    const DECOMPOSITION = MATH_UTILS + 'matrices/decomposition/';
    const UTILS = SRC + 'utils/';
    const PREPROCESSING = SRC + 'preprocessing/';
    const ERROR_CALCULATION = UTILS + 'errorCalculation/';
    const ERROR_HANDLING = UTILS + 'errorHandling/';
    const DATA_MAPPERS = PREPROCESSING + 'dataMappers/';
    const RANDOMIZERS = MATH_UTILS + 'randomizers/';
    const GENERATORS = MATH_UTILS + 'generators/';
    const ML = SRC + 'ml/';

    const TESTS = BASE + '/tests/';
    const TEST_HELPERS = TESTS + 'helpers/';

    return {
        BASE,
        EXAMPLES,
        DATA_FOLDER,
        SRC,
        TESTS,
        TEST_HELPERS,
        CONSTANTS,
        ACTIVATION_FUNCTIONS,
        ERROR_FUNCTIONS,
        LAYERS,
        SCORE,
        NETWORKS,
        NEURAL,
        FREEFORM,
        FREEFORM_PROPAGATION,
        PATTERNS,
        TRAINING,
        PROPAGATION,
        SGD,
        STRATEGIES,
        MATH_UTILS,
        MATRICES,
        HESSIAN,
        DECOMPOSITION,
        UTILS,
        PREPROCESSING,
        ERROR_CALCULATION,
        ERROR_HANDLING,
        DATA_MAPPERS,
        RANDOMIZERS,
        GENERATORS,
        ML
    };
})();