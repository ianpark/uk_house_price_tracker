'use strict'
const query_format = `prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
prefix owl: <http://www.w3.org/2002/07/owl#>
prefix xsd: <http://www.w3.org/2001/XMLSchema#>
prefix sr: <http://data.ordnancesurvey.co.uk/ontology/spatialrelations/>
prefix ukhpi: <http://landregistry.data.gov.uk/def/ukhpi/>
prefix lrppi: <http://landregistry.data.gov.uk/def/ppi/>
prefix skos: <http://www.w3.org/2004/02/skos/core#>
prefix lrcommon: <http://landregistry.data.gov.uk/def/common/>

PREFIX  xsd:  <http://www.w3.org/2001/XMLSchema#>
PREFIX  ukhpi: <http://landregistry.data.gov.uk/def/ukhpi/>

SELECT  ?item ?ukhpi_refMonth ?ukhpi_averagePrice ?ukhpi_averagePriceCash ?ukhpi_averagePriceDetached ?ukhpi_averagePriceExistingProperty ?ukhpi_averagePriceFirstTimeBuyer ?ukhpi_averagePriceFlatMaisonette ?ukhpi_averagePriceFormerOwnerOccupier ?ukhpi_averagePriceMortgage ?ukhpi_averagePriceNewBuild ?ukhpi_averagePriceSA ?ukhpi_averagePriceSemiDetached ?ukhpi_averagePriceTerraced ?ukhpi_housePriceIndex ?ukhpi_housePriceIndexCash ?ukhpi_housePriceIndexDetached ?ukhpi_housePriceIndexExistingProperty ?ukhpi_housePriceIndexFirstTimeBuyer ?ukhpi_housePriceIndexFlatMaisonette ?ukhpi_housePriceIndexFormerOwnerOccupier ?ukhpi_housePriceIndexMortgage ?ukhpi_housePriceIndexNewBuild ?ukhpi_housePriceIndexSA ?ukhpi_housePriceIndexSemiDetached ?ukhpi_housePriceIndexTerraced ?ukhpi_percentageAnnualChange ?ukhpi_percentageAnnualChangeCash ?ukhpi_percentageAnnualChangeDetached ?ukhpi_percentageAnnualChangeExistingProperty ?ukhpi_percentageAnnualChangeFirstTimeBuyer ?ukhpi_percentageAnnualChangeFlatMaisonette ?ukhpi_percentageAnnualChangeFormerOwnerOccupier ?ukhpi_percentageAnnualChangeMortgage ?ukhpi_percentageAnnualChangeNewBuild ?ukhpi_percentageAnnualChangeSemiDetached ?ukhpi_percentageAnnualChangeTerraced ?ukhpi_percentageChange ?ukhpi_percentageChangeCash ?ukhpi_percentageChangeDetached ?ukhpi_percentageChangeExistingProperty ?ukhpi_percentageChangeFirstTimeBuyer ?ukhpi_percentageChangeFlatMaisonette ?ukhpi_percentageChangeFormerOwnerOccupier ?ukhpi_percentageChangeMortgage ?ukhpi_percentageChangeNewBuild ?ukhpi_percentageChangeSemiDetached ?ukhpi_percentageChangeTerraced ?ukhpi_refPeriodDuration ?ukhpi_refPeriodStart ?ukhpi_salesVolume
WHERE
  { ?item ukhpi:refMonth ?ukhpi_refMonth .
    ?item ukhpi:refRegion <http://landregistry.data.gov.uk/id/region/%REGION%>
    OPTIONAL
      { ?item ukhpi:averagePrice ?ukhpi_averagePrice }
    OPTIONAL
      { ?item ukhpi:averagePriceCash ?ukhpi_averagePriceCash }
    OPTIONAL
      { ?item ukhpi:averagePriceDetached ?ukhpi_averagePriceDetached }
    OPTIONAL
      { ?item ukhpi:averagePriceExistingProperty ?ukhpi_averagePriceExistingProperty }
    OPTIONAL
      { ?item ukhpi:averagePriceFirstTimeBuyer ?ukhpi_averagePriceFirstTimeBuyer }
    OPTIONAL
      { ?item ukhpi:averagePriceFlatMaisonette ?ukhpi_averagePriceFlatMaisonette }
    OPTIONAL
      { ?item ukhpi:averagePriceFormerOwnerOccupier ?ukhpi_averagePriceFormerOwnerOccupier }
    OPTIONAL
      { ?item ukhpi:averagePriceMortgage ?ukhpi_averagePriceMortgage }
    OPTIONAL
      { ?item ukhpi:averagePriceNewBuild ?ukhpi_averagePriceNewBuild }
    OPTIONAL
      { ?item ukhpi:averagePriceSA ?ukhpi_averagePriceSA }
    OPTIONAL
      { ?item ukhpi:averagePriceSemiDetached ?ukhpi_averagePriceSemiDetached }
    OPTIONAL
      { ?item ukhpi:averagePriceTerraced ?ukhpi_averagePriceTerraced }
    OPTIONAL
      { ?item ukhpi:housePriceIndex ?ukhpi_housePriceIndex }
    OPTIONAL
      { ?item ukhpi:housePriceIndexCash ?ukhpi_housePriceIndexCash }
    OPTIONAL
      { ?item ukhpi:housePriceIndexDetached ?ukhpi_housePriceIndexDetached }
    OPTIONAL
      { ?item ukhpi:housePriceIndexExistingProperty ?ukhpi_housePriceIndexExistingProperty }
    OPTIONAL
      { ?item ukhpi:housePriceIndexFirstTimeBuyer ?ukhpi_housePriceIndexFirstTimeBuyer }
    OPTIONAL
      { ?item ukhpi:housePriceIndexFlatMaisonette ?ukhpi_housePriceIndexFlatMaisonette }
    OPTIONAL
      { ?item ukhpi:housePriceIndexFormerOwnerOccupier ?ukhpi_housePriceIndexFormerOwnerOccupier }
    OPTIONAL
      { ?item ukhpi:housePriceIndexMortgage ?ukhpi_housePriceIndexMortgage }
    OPTIONAL
      { ?item ukhpi:housePriceIndexNewBuild ?ukhpi_housePriceIndexNewBuild }
    OPTIONAL
      { ?item ukhpi:housePriceIndexSA ?ukhpi_housePriceIndexSA }
    OPTIONAL
      { ?item ukhpi:housePriceIndexSemiDetached ?ukhpi_housePriceIndexSemiDetached }
    OPTIONAL
      { ?item ukhpi:housePriceIndexTerraced ?ukhpi_housePriceIndexTerraced }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChange ?ukhpi_percentageAnnualChange }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeCash ?ukhpi_percentageAnnualChangeCash }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeDetached ?ukhpi_percentageAnnualChangeDetached }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeExistingProperty ?ukhpi_percentageAnnualChangeExistingProperty }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeFirstTimeBuyer ?ukhpi_percentageAnnualChangeFirstTimeBuyer }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeFlatMaisonette ?ukhpi_percentageAnnualChangeFlatMaisonette }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeFormerOwnerOccupier ?ukhpi_percentageAnnualChangeFormerOwnerOccupier }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeMortgage ?ukhpi_percentageAnnualChangeMortgage }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeNewBuild ?ukhpi_percentageAnnualChangeNewBuild }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeSemiDetached ?ukhpi_percentageAnnualChangeSemiDetached }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeTerraced ?ukhpi_percentageAnnualChangeTerraced }
    OPTIONAL
      { ?item ukhpi:percentageChange ?ukhpi_percentageChange }
    OPTIONAL
      { ?item ukhpi:percentageChangeCash ?ukhpi_percentageChangeCash }
    OPTIONAL
      { ?item ukhpi:percentageChangeDetached ?ukhpi_percentageChangeDetached }
    OPTIONAL
      { ?item ukhpi:percentageChangeExistingProperty ?ukhpi_percentageChangeExistingProperty }
    OPTIONAL
      { ?item ukhpi:percentageChangeFirstTimeBuyer ?ukhpi_percentageChangeFirstTimeBuyer }
    OPTIONAL
      { ?item ukhpi:percentageChangeFlatMaisonette ?ukhpi_percentageChangeFlatMaisonette }
    OPTIONAL
      { ?item ukhpi:percentageChangeFormerOwnerOccupier ?ukhpi_percentageChangeFormerOwnerOccupier }
    OPTIONAL
      { ?item ukhpi:percentageChangeMortgage ?ukhpi_percentageChangeMortgage }
    OPTIONAL
      { ?item ukhpi:percentageChangeNewBuild ?ukhpi_percentageChangeNewBuild }
    OPTIONAL
      { ?item ukhpi:percentageChangeSemiDetached ?ukhpi_percentageChangeSemiDetached }
    OPTIONAL
      { ?item ukhpi:percentageChangeTerraced ?ukhpi_percentageChangeTerraced }
    OPTIONAL
      { ?item ukhpi:refPeriodDuration ?ukhpi_refPeriodDuration }
    OPTIONAL
      { ?item ukhpi:refPeriodStart ?ukhpi_refPeriodStart }
    OPTIONAL
      { ?item ukhpi:salesVolume ?ukhpi_salesVolume }
    FILTER ( ?ukhpi_refMonth >= "1990-01"^^xsd:gYearMonth )
    FILTER ( ?ukhpi_refMonth <= "2020-02"^^xsd:gYearMonth )
  }`;
const land_reg_query_url = "http://landregistry.data.gov.uk/app/root/qonsole/query";

var querystring = require('querystring');
var request = require('request');
var Q = require('q');

module.exports = {
    fetch_land_registry_data: function (region_name) {
        let replacements = {'%REGION%': region_name};
        let tmp_query = query_format.replace(/%\w+%/g, function(all) {
            return replacements[all] || all;
        });

        let form = {
            output: 'json',
            url: '/landregistry/query',
            q: tmp_query
        };
        let formData = querystring.stringify(form);
        let contentLength = formData.length;

        let deferred = Q.defer();
        request({
            headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            uri: 'http://landregistry.data.gov.uk/app/root/qonsole/query',
            body: formData,
            method: 'POST'
        }, function (err, res, body) {
            if (err) {
              console.log({event: 'Failed to get land registry data', error: err});
              deferred.reject('Failed to get land registry data');
            } else {
              deferred.resolve(JSON.parse(body));
            }
        });
        return deferred.promise;
    }
}
