
var region_data = {};

function load_region_data(region_name) {
    if (region_data.hasOwnProperty(region_name)) {
        return region_data[region_name];
    } else {
        return Q($.ajax({url: '/region/' + region_name,
                         dataType: 'json'}))
        .then(function(value) {
            region_data[region_name] = value;
            return value;
        });
    }
}

function draw_graph() {
    Q.when(load_region_data($('#region_name').val()))
    .then(function(value) {
        render_graph(value);
    }).catch(function(err) {
        alert('Faile to read data from the server');
    });
}

var randomColorGenerator = function () { 
    return '#' + (Math.random().toString(16) + '666666').slice(2, 8); 
};

function render_graph(input_data) {
    Chart.defaults.global.elements.point.radius = 0;
    Chart.defaults.global.elements.line.borderWidth = 1;
    Chart.defaults.global.elements.line.tension = 0;
    // line chart data
    var chart_data = {
        labels: input_data.ukhpi_refMonth,
        datasets:[{
            label: "Average Price",
            fill: false,
            borderColor: randomColorGenerator(),
            data: input_data.ukhpi_averagePrice
        },
        {
            label: "Average Price (Cash)",
            fill: false,
            borderColor: randomColorGenerator(),
            data: input_data.ukhpi_averagePriceCash
        },
        {
            label: "Average Price (Mortgage)",
            fill: false,
            borderColor: randomColorGenerator(),
            data: input_data.ukhpi_averagePriceMortgage
        },
        {
            label: "Average Price (First Time Buyer)",
            fill: false,
            borderColor: randomColorGenerator(),
            data: input_data.ukhpi_averagePriceFirstTimeBuyer
        },
        {
            label: "Average Price (Former Occupier)",
            fill: false,
            borderColor: randomColorGenerator(),
            data: input_data.ukhpi_averagePriceFormerOwnerOccupier
        },

        ]
    };
    // create the options
    options = {
        fill: false,
        scaleBeginAtZero: true,
        /*This is how to customize the way the labels look :) */
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%>$<%= value %>",
        label: 'test',
        title: {
            display: true,
            text: 'House Price Tracker'
        }
    };
    // get line chart canvas
    hpc_chart = document.getElementById('hpc_chart').getContext('2d')
    var ctx = document.getElementById("hpc_chart");
    var hpc_chart = new Chart(ctx, {
        type: 'line',
        data: chart_data,
        options: options
    });
    /*
    rs = new RangeSliderChart({

        chartData: chart_data,
        chartOpts: options,
        chartType: 'line',
        chartCTX: document.getElementById('hpc_chart').getContext('2d'),

        class: 'my-chart-ranger',

        initial: [3, 10]
    });
    */
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