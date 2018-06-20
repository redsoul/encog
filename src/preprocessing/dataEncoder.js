const _ = require('lodash');
const _dataMapper = require(PATHS.DATA_MAPPERS + '_dataMapper');

class DataEncoder {

    /**
     * @param data {Array} of Objects
     * @param mappingObj {Object}
     * */
    _tranform_data(data, mappingObj){
        const emptyMappingObj = {};
        let _mappingObj = {};
        const transformedData = {};
        let columns = [];
        const result = [];
        const transformedColumns = [];

        //create a empty mapping array
        _.each(data[0], function (value, key) {
            emptyMappingObj[key] = null;
        });
        //the columns not in the mappingObj will not be touched
        _mappingObj = _.defaults(mappingObj, emptyMappingObj);

        //apply the encoder to each column
        _.each(data[0], (value, key) => {
            const mapping = _mappingObj[key];
            if (mapping && mapping instanceof _dataMapper) {
                const pickedRow = _.map(data, function (row) {
                    return row[key];
                });
                transformedData[key] = mapping[this.transformMethod](pickedRow, key);
            }
        });

        //concat every value in one single row
        _.each(transformedData, function (featureData, feature) {
            columns = _.concat(columns, featureData.columns);
            transformedColumns.push(feature);
            _.each(featureData.values, function (row, index) {
                if (result[index] === undefined) {
                    result[index] = [];
                }
                result[index] = _.concat(result[index], row);
            });
        });

        //append the unmapped columns values to the final result
        const unchangedColumns = _.difference(_.keys(_mappingObj), transformedColumns);
        _.each(data, function (row, index) {
            _.each(unchangedColumns, function (column) {
                result[index] = _.concat(result[index], [data[index][column]]);
            });
        });

        return {columns: _.concat(columns, unchangedColumns), values: result};
    }

    /**
     * @param data {Array} of Objects
     * @param mappingObj {Object}
     * */
    fit_transform(data, mappingObj) {
        this.transformMethod = 'fit_transform';
        return this._tranform_data(data, mappingObj);
    }

    /**
     * @param data {Array} of Objects
     * @param mappingObj {Object}
     * */
    transform(data, mappingObj) {
        this.transformMethod = 'transform';
        return this._tranform_data(data, mappingObj);
    }
}

module.exports = DataEncoder;