global.PATHS = require('./paths.js');

const encogLog = require(PATHS.UTILS + 'encogLog');
global.EncogLog = new encogLog();
var requireDir = require('require-dir');

var activationFunctions = requireDir(PATHS.ACTIVATION_FUNCTIONS);
var errorFunctions = requireDir(PATHS.ERROR_FUNCTIONS);
var layers = requireDir(PATHS.LAYERS);
var networks = requireDir(PATHS.NETWORKS);
var patterns = requireDir(PATHS.PATTERNS);
var trainers = requireDir(PATHS.PROPAGATION);
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
