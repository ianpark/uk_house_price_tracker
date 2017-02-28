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

SELECT  ?item ?refMonth ?averagePrice ?averagePriceCash ?averagePriceDetached ?averagePriceExistingProperty ?averagePriceFirstTimeBuyer ?averagePriceFlatMaisonette ?averagePriceFormerOwnerOccupier ?averagePriceMortgage ?averagePriceNewBuild ?averagePriceSA ?averagePriceSemiDetached ?averagePriceTerraced ?housePriceIndex ?housePriceIndexCash ?housePriceIndexDetached ?housePriceIndexExistingProperty ?housePriceIndexFirstTimeBuyer ?housePriceIndexFlatMaisonette ?housePriceIndexFormerOwnerOccupier ?housePriceIndexMortgage ?housePriceIndexNewBuild ?housePriceIndexSA ?housePriceIndexSemiDetached ?housePriceIndexTerraced ?percentageAnnualChange ?percentageAnnualChangeCash ?percentageAnnualChangeDetached ?percentageAnnualChangeExistingProperty ?percentageAnnualChangeFirstTimeBuyer ?percentageAnnualChangeFlatMaisonette ?percentageAnnualChangeFormerOwnerOccupier ?percentageAnnualChangeMortgage ?percentageAnnualChangeNewBuild ?percentageAnnualChangeSemiDetached ?percentageAnnualChangeTerraced ?percentageChange ?percentageChangeCash ?percentageChangeDetached ?percentageChangeExistingProperty ?percentageChangeFirstTimeBuyer ?percentageChangeFlatMaisonette ?percentageChangeFormerOwnerOccupier ?percentageChangeMortgage ?percentageChangeNewBuild ?percentageChangeSemiDetached ?percentageChangeTerraced ?refPeriodDuration ?refPeriodStart ?salesVolume
WHERE
  { ?item ukhpi:refMonth ?refMonth .
    ?item ukhpi:refRegion <http://landregistry.data.gov.uk/id/region/%REGION%>
    OPTIONAL
      { ?item ukhpi:averagePrice ?averagePrice }
    OPTIONAL
      { ?item ukhpi:averagePriceCash ?averagePriceCash }
    OPTIONAL
      { ?item ukhpi:averagePriceDetached ?averagePriceDetached }
    OPTIONAL
      { ?item ukhpi:averagePriceExistingProperty ?averagePriceExistingProperty }
    OPTIONAL
      { ?item ukhpi:averagePriceFirstTimeBuyer ?averagePriceFirstTimeBuyer }
    OPTIONAL
      { ?item ukhpi:averagePriceFlatMaisonette ?averagePriceFlatMaisonette }
    OPTIONAL
      { ?item ukhpi:averagePriceFormerOwnerOccupier ?averagePriceFormerOwnerOccupier }
    OPTIONAL
      { ?item ukhpi:averagePriceMortgage ?averagePriceMortgage }
    OPTIONAL
      { ?item ukhpi:averagePriceNewBuild ?averagePriceNewBuild }
    OPTIONAL
      { ?item ukhpi:averagePriceSA ?averagePriceSA }
    OPTIONAL
      { ?item ukhpi:averagePriceSemiDetached ?averagePriceSemiDetached }
    OPTIONAL
      { ?item ukhpi:averagePriceTerraced ?averagePriceTerraced }
    OPTIONAL
      { ?item ukhpi:housePriceIndex ?housePriceIndex }
    OPTIONAL
      { ?item ukhpi:housePriceIndexCash ?housePriceIndexCash }
    OPTIONAL
      { ?item ukhpi:housePriceIndexDetached ?housePriceIndexDetached }
    OPTIONAL
      { ?item ukhpi:housePriceIndexExistingProperty ?housePriceIndexExistingProperty }
    OPTIONAL
      { ?item ukhpi:housePriceIndexFirstTimeBuyer ?housePriceIndexFirstTimeBuyer }
    OPTIONAL
      { ?item ukhpi:housePriceIndexFlatMaisonette ?housePriceIndexFlatMaisonette }
    OPTIONAL
      { ?item ukhpi:housePriceIndexFormerOwnerOccupier ?housePriceIndexFormerOwnerOccupier }
    OPTIONAL
      { ?item ukhpi:housePriceIndexMortgage ?housePriceIndexMortgage }
    OPTIONAL
      { ?item ukhpi:housePriceIndexNewBuild ?housePriceIndexNewBuild }
    OPTIONAL
      { ?item ukhpi:housePriceIndexSA ?housePriceIndexSA }
    OPTIONAL
      { ?item ukhpi:housePriceIndexSemiDetached ?housePriceIndexSemiDetached }
    OPTIONAL
      { ?item ukhpi:housePriceIndexTerraced ?housePriceIndexTerraced }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChange ?percentageAnnualChange }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeCash ?percentageAnnualChangeCash }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeDetached ?percentageAnnualChangeDetached }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeExistingProperty ?percentageAnnualChangeExistingProperty }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeFirstTimeBuyer ?percentageAnnualChangeFirstTimeBuyer }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeFlatMaisonette ?percentageAnnualChangeFlatMaisonette }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeFormerOwnerOccupier ?percentageAnnualChangeFormerOwnerOccupier }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeMortgage ?percentageAnnualChangeMortgage }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeNewBuild ?percentageAnnualChangeNewBuild }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeSemiDetached ?percentageAnnualChangeSemiDetached }
    OPTIONAL
      { ?item ukhpi:percentageAnnualChangeTerraced ?percentageAnnualChangeTerraced }
    OPTIONAL
      { ?item ukhpi:percentageChange ?percentageChange }
    OPTIONAL
      { ?item ukhpi:percentageChangeCash ?percentageChangeCash }
    OPTIONAL
      { ?item ukhpi:percentageChangeDetached ?percentageChangeDetached }
    OPTIONAL
      { ?item ukhpi:percentageChangeExistingProperty ?percentageChangeExistingProperty }
    OPTIONAL
      { ?item ukhpi:percentageChangeFirstTimeBuyer ?percentageChangeFirstTimeBuyer }
    OPTIONAL
      { ?item ukhpi:percentageChangeFlatMaisonette ?percentageChangeFlatMaisonette }
    OPTIONAL
      { ?item ukhpi:percentageChangeFormerOwnerOccupier ?percentageChangeFormerOwnerOccupier }
    OPTIONAL
      { ?item ukhpi:percentageChangeMortgage ?percentageChangeMortgage }
    OPTIONAL
      { ?item ukhpi:percentageChangeNewBuild ?percentageChangeNewBuild }
    OPTIONAL
      { ?item ukhpi:percentageChangeSemiDetached ?percentageChangeSemiDetached }
    OPTIONAL
      { ?item ukhpi:percentageChangeTerraced ?percentageChangeTerraced }
    OPTIONAL
      { ?item ukhpi:refPeriodDuration ?refPeriodDuration }
    OPTIONAL
      { ?item ukhpi:refPeriodStart ?refPeriodStart }
    OPTIONAL
      { ?item ukhpi:salesVolume ?salesVolume }
    FILTER ( ?refMonth >= "1990-01"^^xsd:gYearMonth )
    FILTER ( ?refMonth <= "2020-02"^^xsd:gYearMonth )
  }`;
const land_reg_query_url = "http://landregistry.data.gov.uk/app/root/qonsole/query";

var logger = require('winston');
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
              logger.error({event: 'Failed to get land registry data', error: err});
              deferred.reject('Failed to get land registry data');
            } else {
              deferred.resolve(JSON.parse(body));
            }
        });
        return deferred.promise;
    }
}
