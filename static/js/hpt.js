requirejs(["modals"], function(util) {});
requirejs(["charts"], function(util) {});
var region_list;
var region_data = {};
var selected_region = [];
var selected_option = [];
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
    if (selected_region.length == 0) {
        get_modal('warning').msg('Please add at least one region. You might have forgot pressing enter.');
        return;
    }
    if (selected_option.length == 0) {
        get_modal('warning').msg('Please set at least one option');
        return;
    }
    var graph_detail = {region: selected_region,
                        data: selected_option,
                        period: $('#period').val().split(' ')
                       };
    var progress_modal = get_modal('progress').show();
    Q.all(graph_detail.region.map(load_region_data))
    .then(function() {
        setTimeout(function() {
            progress_modal.hide();
            setTimeout(function() {
                render_graph(graph_detail);
            }, 500);
        }, 200);
        
    }).catch(function(err) {
        progress_modal.hide();
        var message = 'Failed to read data from the server';
        if (err.responseJSON) {}
            message += "\n: No region data for " + err.responseJSON.region_name;
        get_modal('warning').msg(message);
    });
}

// On load
$(function() {
    // Get the <datalist> and <input> elements.
    var dataList = document.getElementById('region-search-data');
    var input = document.getElementById('region-search');

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
    $('#mytest').on('click', function() {
        var sel = window.getSelection ? window.getSelection() : document.selection;
        if (sel) {
            if (sel.removeAllRanges) {
                sel.removeAllRanges();
            } else if (sel.empty) {
                sel.empty();
            }
        }
        //html2clipboard($('#card').html());
        var range = document.createRange();
        //range.selectNode(tmpEl);
        range.selectNode(document.getElementById("chart-ground"));
        sel.addRange(range);
        // copy
        document.execCommand("copy");
        alert('Copied to clipboard. CTRL+V in your email app.');
    });

    // Region field autocompletion
    Q($.ajax({url: 'region.json', dataType: 'json'}))
    .then(function(result) {
        region_list = result;
        $( "#region-search" ).autocomplete({
            source: region_list,
            autoFocus: true,
            delay: 0,
            minLength: 3,
            select: function( event, ui ) {
                console.log(ui.item.value);
                if (add_to_region_list(ui.item.value)) {
                    display_selected_region();
                }
                setTimeout(function() {
                    $('#region-search').val('');
                }, 0);
            }
        });
    });
});