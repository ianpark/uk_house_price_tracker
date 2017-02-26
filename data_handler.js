'use strict'
var fs = require('fs'),
    path = require('path'),
    Q = require('q'),
    data_fetcher = require(__dirname + '/data_fetcher')

const data_path = __dirname + '/data/';
let region_in_progress = {};

function convert_data(orig_data) {
    try {
        let tmp = JSON.parse(orig_data);
        if (tmp.results.bindings.length == 0) {
            throw 'Failed to obtain any data';
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
        throw 'Failed to convert data from Land Registry: ' + err;
    }
}

module.exports = {
    populate_region_data_json: function(region_name) {
        return Q.nfcall(fs.readFile,
                path.join(data_path, 'region_' + region_name + '.json'))
        .then(null, function(err) {
            console.log({event: 'Failed to read region file', error: err});
            return data_fetcher.fetch_land_registry_data(region_name)
            .then(function (data) {
                return Q.nfcall(fs.writeFile,
                                path.join(data_path,'region_' + region_name + '_original.json'),
                                data.result)
                        .then(function() {
                            let converted_data = JSON.stringify(convert_data(data.result));
                            return Q.nfcall(fs.writeFile,
                                    path.join(data_path, 'region_' + region_name + '.json'), converted_data)
                            .then(function() {
                                return converted_data;
                            })
                        });
            });
        });
    }
}


/*
{ head: [],
  data: 
   { item: [],
     refMonth: [],
     refRegion: [],
     averagePrice: [],
     averagePriceCash: [],
     averagePriceDetached: [],
     averagePriceExistingProperty: [],
     averagePriceFirstTimeBuyer: [],
     averagePriceFlatMaisonette: [],
     averagePriceFormerOwnerOccupier: [],
     averagePriceMortgage: [],
     averagePriceNewBuild: [],
     averagePriceSA: [],
     averagePriceSemiDetached: [],
     averagePriceTerraced: [],
     housePriceIndex: [],
     housePriceIndexCash: [],
     housePriceIndexDetached: [],
     housePriceIndexExistingProperty: [],
     housePriceIndexFirstTimeBuyer: [],
     housePriceIndexFlatMaisonette: [],
     housePriceIndexFormerOwnerOccupier: [],
     housePriceIndexMortgage: [],
     housePriceIndexNewBuild: [],
     housePriceIndexSA: [],
     housePriceIndexSemiDetached: [],
     housePriceIndexTerraced: [],
     percentageAnnualChange: [],
     percentageAnnualChangeCash: [],
     percentageAnnualChangeDetached: [],
     percentageAnnualChangeExistingProperty: [],
     percentageAnnualChangeFirstTimeBuyer: [],
     percentageAnnualChangeFlatMaisonette: [],
     percentageAnnualChangeFormerOwnerOccupier: [],
     percentageAnnualChangeMortgage: [],
     percentageAnnualChangeNewBuild: [],
     percentageAnnualChangeSemiDetached: [],
     percentageAnnualChangeTerraced: [],
     percentageChange: [],
     percentageChangeCash: [],
     percentageChangeDetached: [],
     percentageChangeExistingProperty: [],
     percentageChangeFirstTimeBuyer: [],
     percentageChangeFlatMaisonette: [],
     percentageChangeFormerOwnerOccupier: [],
     percentageChangeMortgage: [],
     percentageChangeNewBuild: [],
     percentageChangeSemiDetached: [],
     percentageChangeTerraced: [],
     refPeriodDuration: [],
     refPeriodStart: [],
     salesVolume: [] } }
     */
