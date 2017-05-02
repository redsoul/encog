global.__BASE = __dirname;
global.__SRC = __BASE + '/src/';
global.__TESTS = __BASE + '/tests/';
global.__CONSTANTS = require(__SRC + 'constants.js');
global.__ACTIVACTION_FUNCTIONS = __SRC + 'activation/functions/';
global.__ERROR_FUNCTIONS = __SRC + 'neural/error/functions/';
global.__LAYERS = __SRC + 'neural/layers/';
global.__NETWORKS = __SRC + 'neural/networks/';
global.__PATTERNS = __SRC + 'patterns/';
global.__TRAINING = __SRC + 'neural/training/';
global.__PROPAGATION = __TRAINING + 'propagation/';
global.__STRATEGIES = __TRAINING + 'strategy/';
global.__MATHUTILS = __SRC + 'mathUtils/';
global.__MATRICES = __SRC + 'mathUtils/matrices/';
global.__HESSIAN = __MATHUTILS + 'matrices/hessian/';
global.__DECOMPOSITION = __MATHUTILS + 'matrices/decomposition/';
global.__UTILS = __SRC + 'utils/';
global.__RANDOMIZERS = __MATHUTILS + 'randomizers/';
global.__GENERATORS = __MATHUTILS + 'generators/';

global.__TEST_HELPERS = __TESTS + 'helpers/';

const encogLog = require(__UTILS + 'encogLog');
global.EncogLog = new encogLog();
var requireDir = require('require-dir');

var activationFunctions = requireDir(__ACTIVACTION_FUNCTIONS);
var errorFunctions = requireDir(__ERROR_FUNCTIONS);
var layers = requireDir(__LAYERS);
var networks = requireDir(__NETWORKS);
var patterns = requireDir(__PATTERNS);
var trainers = requireDir(__PROPAGATION);
// var examples = requireDir('./examples');

module.exports = {
    activationFunctions,
    errorFunctions,
    layers,
    networks,
    patterns,
    trainers,
    // examples
};
