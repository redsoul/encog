let fs = require("fs"); //must use let instead of const to be able to be mocked by rewire
const requireAll = require('require-all');
const Networks = requireAll(PATHS.NETWORKS);
const EncogError = require(PATHS.ERROR_HANDLING + 'encog');
const _ = require('lodash');

class FileUtils {
    constructor() {

    }

    /**
     * @param network {BasicNetwork | HopfieldNetwork}
     * @param filename {String}
     */
    static saveNetwork(network, filename) {
        const networkData = JSON.stringify(network);

        fs.writeFileSync(filename, networkData);
    }

    /**
     * @param filename {String}
     * @returns {BasicNetwork | HopfieldNetwork}
     */
    static loadNetwork(filename) {
        const fileContent = fs.readFileSync(filename);
        const networkData = JSON.parse(fileContent);
        let newBasicNetwork;
        const validNetworkTypes = ['BasicNetwork', 'HopfieldNetwork'];

        if (validNetworkTypes.indexOf(networkData.type) === -1) {
            throw new EncogError('Not a valid network type');
        }

        const networkType = _.toLower(_.trim(networkData.type, 'Network'));

        newBasicNetwork = new Networks[networkType]();
        newBasicNetwork.fromJSON(networkData);

        return newBasicNetwork;
    }
}

module.exports = FileUtils;