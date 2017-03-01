'use strict'
var logger = require('winston'),
    fs = require('fs'),
    path = require('path'),
    Q = require('q'),
    appDir = path.dirname(require.main.filename),
    data_fetcher = require(appDir + '/lib/data_fetcher');

const data_path = appDir + '/data/';
let region_in_progress = {};

function convert_data(orig_data, region_name) {
    try {
        let tmp = JSON.parse(orig_data);
        if (tmp.results.bindings.length == 0) {
            throw 'No region data';
        }
        // Organise the map to be sorted by datetime
        let data = {};
        tmp.results.bindings.forEach(function(item_dict) {
            data[item_dict['refMonth'].value] = item_dict;
        });

        let output = {};
        tmp.head.vars.forEach(function (item) {
            if (item === 'item' || item === 'refRegion') return;
            output[item] = Array(Object.keys(data).length);
        });

        let index = 0;
        Object.keys(data).sort().forEach(function(key) {
            let monthly_data = data[key]
            for (let type in monthly_data) {
                if (type === 'item' || type === 'refRegion') continue;
                if (type === 'refMonth') {
                    output[type][index] = monthly_data[type].value;
                } else {
                    output[type][index] = parseInt(monthly_data[type].value);
                }
            }
            index++;
        });
        return output;
    } catch (err) {
        throw 'Failed to process the data from Land Registry: ' + err;
    }
}

module.exports = {
    populate_region_data_json: function(region_name) {
        return Q.nfcall(fs.readFile,
                path.join(data_path, 'region_' + region_name + '.json'))
        .then(null, function(err) {
            logger.info({event: 'not-collected-region-request', region_name: region_name});
            return data_fetcher.fetch_land_registry_data(region_name)
            .then(function (data) {
                let converted_data = JSON.stringify(convert_data(data.result, region_name));
                return Q.nfcall(fs.writeFile,
                        path.join(data_path, 'region_' + region_name + '.json'), converted_data)
                .then(function() {
                    return converted_data;
                });
            });
        });
    }
}