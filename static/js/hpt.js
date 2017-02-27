var region_data = {};
var selected_region = ['london', 'manchester', 'winchester', 'richmond-upon-thames'];

function load_region_data(region_name) {
    if (!region_data.hasOwnProperty(region_name)) {
        console.log('Load data for ' + region_name);
        return Q($.ajax({url: '/region/' + region_name,
                         dataType: 'json'}))
        .then(function(value) {
            region_data[region_name] = value;
        });
    }
}

function draw_graph() {
    $('#in_progress_dlg').modal('show');
    var graph_detail = {region: selected_region,
                        data: $('#param_name').val().split(' '),
                        period: $('#period').val().split(' ')
                       };
    Q.all(graph_detail.region.map(load_region_data))
    .then(function() {
        setTimeout(function() {
            $('#in_progress_dlg').modal('hide');
            render_graph(graph_detail);
        }, 500);
        
    }).catch(function(err) {
        $('#in_progress_dlg').find('.modal-body').text('Faile to read data from the server');
    });
}

var randomColorGenerator = function () { 
    return '#' + (Math.random().toString(16) + '666666').slice(2, 8); 
};

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}

function getColour(str) {
    console.log(str);
    console.log(intToRGB(hashCode(str)));
    return '#' + intToRGB(hashCode(str));
}

function render_graph(detail) {
    Chart.defaults.global.elements.point.radius = 0;
    Chart.defaults.global.elements.line.borderWidth = 2;
    Chart.defaults.global.elements.line.tension = 0;
    Chart.defaults.global.elements.line.fill = false;
    Chart.defaults.global.elements.line.tension = 0;

    var chart_data_set = [];
    var idx_begin = region_data[detail.region[0]].refMonth.indexOf(detail.period[0]);
    var idx_end = region_data[detail.region[0]].refMonth.indexOf(detail.period[1], idx_begin);
    detail.region.forEach(function(region_name) {
        detail.data.forEach(function(data_name) {
            var label = region_name + '-' + data_name;
            chart_data_set.push({
                label: label,
                borderColor: getColour(label),
                data: region_data[region_name][data_name].slice(idx_begin, idx_end)
            });
        });
    });

    // line chart data
    var chart_data = {
        labels: region_data[detail.region[0]].refMonth.slice(idx_begin, idx_end),
        datasets: chart_data_set
    };
    // create the options
    options = {
        fill: false,
        scaleBeginAtZero: true,
        /*This is how to customize the way the labels look :) */
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%>$<%= value %>",
        label: 'test',
        responsive: true,
        maintainAspectRatio: false,
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


// On load
$(function() {
    // Get the <datalist> and <input> elements.
    var dataList = document.getElementById('region_search_data');
    var input = document.getElementById('region_search');

    // Create a new XMLHttpRequest.
    var request = new XMLHttpRequest();
    // Handle state changes for the request.
    request.onreadystatechange = function (response) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                // Parse the JSON
                var jsonOptions = JSON.parse(request.responseText);

                // Loop over the JSON array.
                jsonOptions.forEach(function (item) {
                    // Create a new <option> element.
                    var option = document.createElement('option');
                    // Set the value using the item in the JSON array.
                    option.value = item;
                    // Add the <option> element to the <datalist>.
                    dataList.appendChild(option);
                });

                // Update the placeholder text.
                input.placeholder = "e.g. richmond-upon-thames, and press enter key to append.";
            } else {
                // An error occured :(
                input.placeholder = "Couldn't load datalist options :(";
            }
        }
    };

    // Update the placeholder text.
    input.placeholder = "Loading options...";

    // Set up and make the request.
    request.open('GET', 'region.json', true);
    request.send();


    function delete_from_region_list(val) {
        var idx = selected_region.indexOf(val);
        if (idx > -1) {
            selected_region.splice(idx, 1);
            return true;
        }
        return false;
    }

    function add_to_region_list(val) {
        var idx = selected_region.indexOf(val);
        if (idx == -1) {
            selected_region.push(val);
            return true;
        }
        return false;
    }
    function display_selected_region() {
        $('#selected_region').html('');
        selected_region.forEach(function(val) {
            var element_id = 'region_' + val + '_selected';
            item = $("<span class='label label-success' style='margin-right: 2px'>" + val +  " <span class='glyphicon glyphicon-remove'></span></span>");
            item.css('margin-right', '2px');
            item.css('display', 'inline-block');
            item.attr("id", element_id);
            item.click(function() {
                delete_from_region_list(val);
                $('#' + element_id).remove();
            });
            $('#selected_region').append(item); 
        });
    }
    $('#region_search').on('keypress',function (e) {
        if (e.which == 13) {
            if (add_to_region_list($('#region_search').val())) {
                display_selected_region();
            }
            $('#region_search').val('');
        }
    });
    display_selected_region();
});

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