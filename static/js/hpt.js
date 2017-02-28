var region_data = {};
var selected_region = ['richmond-upon-thames'];
var selected_option = ['averagePrice'];
var data_options = {
    'averagePrice': [
        'Cash',
        'ExistingProperty',
        'FirstTimeBuyer',
        'FormerOwnerOccupier',
        'Mortgage',
        'NewBuild',
        'SA'
    ],
    'housePriceIndex': [
        'Cash',
        'ExistingProperty',
        'FirstTimeBuyer',
        'FormerOwnerOccupier',
        'Mortgage',
        'NewBuild',
        'SA'
    ],
    'percentageAnnualChange': [
        'Cash',
        'ExistingProperty',
        'FirstTimeBuyer',
        'FormerOwnerOccupier',
        'Mortgage',
        'NewBuild',
        'SA'
    ],
    'salesVolume': []
}

var dummy_options = ['averagePrice',
'averagePriceCash',
'averagePriceDetached',
'averagePriceExistingProperty',
'averagePriceFirstTimeBuyer',
'averagePriceFlatMaisonette',
'averagePriceFormerOwnerOccupier',
'averagePriceMortgage',
'averagePriceNewBuild',
'averagePriceSA',
'averagePriceSemiDetached',
'averagePriceTerraced',
'housePriceIndex',
'housePriceIndexCash',
'housePriceIndexDetached',
'housePriceIndexExistingProperty',
'housePriceIndexFirstTimeBuyer',
'housePriceIndexFlatMaisonette',
'housePriceIndexFormerOwnerOccupier',
'housePriceIndexMortgage',
'housePriceIndexNewBuild',
'housePriceIndexSA',
'housePriceIndexSemiDetached',
'housePriceIndexTerraced',
'percentageAnnualChange',
'percentageAnnualChangeCash',
'percentageAnnualChangeDetached',
'percentageAnnualChangeExistingProperty',
'percentageAnnualChangeFirstTimeBuyer',
'percentageAnnualChangeFlatMaisonette',
'percentageAnnualChangeFormerOwnerOccupier',
'percentageAnnualChangeMortgage',
'percentageAnnualChangeNewBuild',
'percentageAnnualChangeSemiDetached',
'percentageAnnualChangeTerraced',
'percentageChange',
'percentageChangeCash',
'percentageChangeDetached',
'percentageChangeExistingProperty',
'percentageChangeFirstTimeBuyer',
'percentageChangeFlatMaisonette',
'percentageChangeFormerOwnerOccupier',
'percentageChangeMortgage',
'percentageChangeNewBuild',
'percentageChangeSemiDetached',
'percentageChangeTerraced',
'salesVolume'];


function getIndexFromList(str, prefixes) {
    var i = prefixes.length;
    while (i-- > 0)
        if (str.lastIndexOf(prefixes[i], 0) === 0)
            return i;
    return 0;
}

var chart_id_sequence = 0;

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
                        data: selected_option,
                        period: $('#period').val().split(' ')
                       };
    Q.all(graph_detail.region.map(load_region_data))
    .then(function() {
        setTimeout(function() {
            $('#in_progress_dlg').modal('hide');
            setTimeout(function() {
                render_graph(graph_detail);
            }, 500);
        }, 200);
        
    }).catch(function(err) {
        $('#in_progress_dlg').modal('hide');
        var message = 'Failed to read data from the server';
        if (err.responseJSON) {}
            message += "\n: No region data for " + err.responseJSON.region_name;
        $('#failure_dlg').find('.modal-body').text(message);
        $('#failure_dlg').modal('show');
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
    Chart.defaults.global.tooltips.enabled = true;
    Chart.defaults.global.tooltips.intersect = false;
    Chart.defaults.global.tooltips.position = 'average';
    Chart.defaults.global.tooltips.mode = 'nearest';
    Chart.defaults.global.tooltips.backgroundColor = 'rgba(0,0,0,0.5)'
    Chart.defaults.global.elements.point.radius = 0;
    Chart.defaults.global.elements.line.borderWidth = 1;
    Chart.defaults.global.elements.line.tension = 0;
    Chart.defaults.global.elements.line.fill = false;

    var second_axis_prefix = ['averagePrice', 'housePriceIndex', 'percentage','sales'];
    var axis_need = [false,false,false,false];
    var formatting_function = [
        function(value, index, values) {
            return "£" + (value > 999 ? (value/1000).toFixed(0) + 'k' : value);
        },
        function(value, index, values) {
            return value;
        },
        function(value, index, values) {
            return value + "%";
        },
        function(value, index, values) {
            return value;
        }
    ]
    var chart_data_set = [];
    var idx_begin = region_data[detail.region[0]].refMonth.indexOf(detail.period[0]);
    var idx_end = region_data[detail.region[0]].refMonth.indexOf(detail.period[1], idx_begin);
    detail.region.forEach(function(region_name) {
        detail.data.forEach(function(data_name) {
            var axis_idx = getIndexFromList(data_name, second_axis_prefix);
            axis_need[axis_idx] = true;
            var label = region_name + '-' + data_name;
            chart_data_set.push({
                label: label,
                yAxisID: 'axis'+axis_idx,
                borderColor: getColour(label),
                backgroundColor: getColour(label),
                data: region_data[region_name][data_name].slice(idx_begin, idx_end)
            });
        });
    });

    var scale_option = {yAxes:[]};
    var side = 'left';
    for(var idx = 0 ; idx < axis_need.length ; ++idx) {
        if (axis_need[idx]) {
            scale_option.yAxes.push({
                id: 'axis'+idx,
                type: 'linear',
                position: side,
                ticks: {
                    callback: formatting_function[idx]
                }
            });
            // toggle side
            side = (side == 'left' ? 'right' : 'left');
        }
    }

    // line chart data
    var chart_data = {
        labels: region_data[detail.region[0]].refMonth.slice(idx_begin, idx_end),
        datasets: chart_data_set
    };
    // create the options
    options = {
        fill: false,
        scales: scale_option,
        /*This is how to customize the way the labels look :) */
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%>$<%= value %>",
        label: 'test',
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'House Price Tracker'
        },
        events: ['click', 'mousemove'],
        onClick: function(e) {
            console.log(e);
        },
        hover: {
            onHover: function(e) {
                this.chart.ctx.layerX = e.layerX;
            },
        },
        animation: {
            duration: 2000,
            onProgress: function(animation) {
                var x_pos = this.chart.ctx.layerX;
                if (x_pos > this.chartArea.left && x_pos < this.chartArea.right) {
                    this.chart.ctx.beginPath();
                    this.chart.ctx.moveTo(this.chart.ctx.layerX, this.chartArea.top);
                    this.chart.ctx.setLineDash([3, 3]);
                    this.chart.ctx.strokeStyle = '#888888';
                    this.chart.ctx.lineTo(this.chart.ctx.layerX, this.chartArea.bottom);
                    this.chart.ctx.stroke();
                    this.chart.ctx.setLineDash([]);
                }
            },
        }
    };
    // Get chart panel
    var chart_id = "chart_palen_" + chart_id_sequence++;
    var chart_panel = $("<div id='" + chart_id + "' class='row chart-panel'></div>");
    var chart_panel_head = $("<div class='chart-panel-head'> " + detail.region.join(' ') + " / " +
                         detail.data.join(' ') + " / " + detail.period.join('_') + "</div>");
    var close_icon = $("<span class='glyphicon glyphicon-remove-sign clickable' aria-hidden='true' style='color: #992222;'></span>");
    close_icon.on('click', function () {
        $('#'+chart_id).slideUp("fast", function() {
            $('#'+chart_id).remove();
        });
    });
    chart_panel_head.prepend(close_icon);
    chart_panel.append(chart_panel_head);
    // Create a new canvas and add to the panel to activate it
    var new_canvas = $('<canvas></canvas>');
    chart_panel.append($("<div style='height: 400px;'></div>").append(new_canvas));
    chart_panel.prependTo($('#chart-ground')).slideDown("fast");
    //$('#chart-ground').prepend(chart_panel);

    var hpc_chart = new Chart(new_canvas, {
        type: 'line',
        data: chart_data,
        options: options
    });

}


// On load
$(function() {
    // Get the <datalist> and <input> elements.
    var dataList = document.getElementById('region-search-data');
    var input = document.getElementById('region-search');

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
                input.placeholder = "Local authorities, UK regions or counties. Press enter key to add.";
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
    // Display Selected Region
    function delete_from_region_list(val) {
        var idx = selected_region.indexOf(val);
        if (idx > -1) {
            selected_region.splice(idx, 1);
            return true;
        }
        return false;
    }
    // Display Selected Region
    function add_to_region_list(val) {
        var idx = selected_region.indexOf(val);
        if (idx == -1) {
            selected_region.push(val);
            return true;
        }
        return false;
    }
    function display_selected_region() {
        $('#selected-region').html('');
        selected_region.forEach(function(val) {
            var element_id = 'region_' + val + '_selected';
            item = $("<span class='label label-success' style='margin-right: 2px'>" + val +  " <span class='glyphicon glyphicon-remove  clickable'></span></span>");
            item.css('margin-right', '2px');
            item.css('display', 'inline-block');
            item.attr("id", element_id);
            item.click(function() {
                delete_from_region_list(val);
                $('#' + element_id).remove();
            });
            $('#selected-region').append(item); 
        });
    }
    $('#region-search').on('keypress',function (e) {
        if (e.which == 13) {
            if (add_to_region_list($('#region-search').val())) {
                display_selected_region();
            }
            $('#region-search').val('');
        }
    });
    display_selected_region();

    // Display selected options
    function add_to_option_list(val) {
        var idx = selected_option.indexOf(val);
        if (idx == -1) {
            selected_option.push(val);
            return true;
        }
        return false;
    }
    function delete_from_option_list(val) {
        var idx = selected_option.indexOf(val);
        if (idx > -1) {
            selected_option.splice(idx, 1);
            return true;
        }
        return false;
    }
    function display_options() {
        $('#option-container').html('');
        dummy_options.forEach(function(val) {
            var element_id = 'option_' + val + '_selected';
            
            item = $("<span class='label label-primary clickable' style='margin-right: 2px'>" + val +  "</span>");
            item.css('margin-right', '2px');
            item.css('margin-bottom', '2px');
            item.css('display', 'inline-block');
            item.css('font-weight', '400');
            item.attr("id", element_id);
            if (selected_option.indexOf(val) != -1) {
                item.on('click', function() {
                    delete_from_option_list(val);
                    display_options();
                });           
            } else {
                item.css('background-color', '#BBBBBB');
                item.on('click', function() {
                    add_to_option_list(val);
                    display_options();
                });
            }

            $('#option-container').append(item); 
        });
    }
    display_options();
});

/*
averagePrice

housePriceIndex

percentageAnnual

salesVolume



Cash
ExistingProperty
FirstTimeBuyer
FormerOwnerOccupier
Mortgage
NewBuild
SA

All Property Types
FlatMaisonette Terraced SemiDetached Detached
*/
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
