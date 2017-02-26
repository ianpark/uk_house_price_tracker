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
        // Organise the map to be sorted by datetime
        let data = {};
        tmp.results.bindings.forEach(function(item_dict) {
            data[item_dict['ukhpi_refMonth'].value] = item_dict;
        });

        let output = {};
        tmp.head.vars.forEach(function (item) {
            if (item === 'item' || item === 'ukhpi_refRegion') return;
            output[item] = Array(Object.keys(data).length);
        });

        let index = 0;
        Object.keys(data).sort().forEach(function(key) {
            let monthly_data = data[key]
            for (let type in monthly_data) {
                if (type === 'item' || type === 'ukhpi_refRegion') continue;
                output[type][index] = parseInt(monthly_data[type].value);
            }
            index++;
        });
        return output;
    } catch (err) {
        console.log(err);
        throw 'Failed to convert data from Land Registry';
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
     ukhpi_refMonth: [],
     ukhpi_refRegion: [],
     ukhpi_averagePrice: [],
     ukhpi_averagePriceCash: [],
     ukhpi_averagePriceDetached: [],
     ukhpi_averagePriceExistingProperty: [],
     ukhpi_averagePriceFirstTimeBuyer: [],
     ukhpi_averagePriceFlatMaisonette: [],
     ukhpi_averagePriceFormerOwnerOccupier: [],
     ukhpi_averagePriceMortgage: [],
     ukhpi_averagePriceNewBuild: [],
     ukhpi_averagePriceSA: [],
     ukhpi_averagePriceSemiDetached: [],
     ukhpi_averagePriceTerraced: [],
     ukhpi_housePriceIndex: [],
     ukhpi_housePriceIndexCash: [],
     ukhpi_housePriceIndexDetached: [],
     ukhpi_housePriceIndexExistingProperty: [],
     ukhpi_housePriceIndexFirstTimeBuyer: [],
     ukhpi_housePriceIndexFlatMaisonette: [],
     ukhpi_housePriceIndexFormerOwnerOccupier: [],
     ukhpi_housePriceIndexMortgage: [],
     ukhpi_housePriceIndexNewBuild: [],
     ukhpi_housePriceIndexSA: [],
     ukhpi_housePriceIndexSemiDetached: [],
     ukhpi_housePriceIndexTerraced: [],
     ukhpi_percentageAnnualChange: [],
     ukhpi_percentageAnnualChangeCash: [],
     ukhpi_percentageAnnualChangeDetached: [],
     ukhpi_percentageAnnualChangeExistingProperty: [],
     ukhpi_percentageAnnualChangeFirstTimeBuyer: [],
     ukhpi_percentageAnnualChangeFlatMaisonette: [],
     ukhpi_percentageAnnualChangeFormerOwnerOccupier: [],
     ukhpi_percentageAnnualChangeMortgage: [],
     ukhpi_percentageAnnualChangeNewBuild: [],
     ukhpi_percentageAnnualChangeSemiDetached: [],
     ukhpi_percentageAnnualChangeTerraced: [],
     ukhpi_percentageChange: [],
     ukhpi_percentageChangeCash: [],
     ukhpi_percentageChangeDetached: [],
     ukhpi_percentageChangeExistingProperty: [],
     ukhpi_percentageChangeFirstTimeBuyer: [],
     ukhpi_percentageChangeFlatMaisonette: [],
     ukhpi_percentageChangeFormerOwnerOccupier: [],
     ukhpi_percentageChangeMortgage: [],
     ukhpi_percentageChangeNewBuild: [],
     ukhpi_percentageChangeSemiDetached: [],
     ukhpi_percentageChangeTerraced: [],
     ukhpi_refPeriodDuration: [],
     ukhpi_refPeriodStart: [],
     ukhpi_salesVolume: [] } }
     */
