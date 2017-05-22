class FileUtils {
    constructor() {

    }

    static saveNetwork(network, filename) {
        console.log(JSON.stringify(network));
    }
}

module.exports = FileUtils;