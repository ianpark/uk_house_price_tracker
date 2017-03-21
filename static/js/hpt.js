requirejs(["modals"], function(util) {});
requirejs(["charts"], function(util) {});
var region_data = {};
var selected_region = [];
var selected_option = ['averagePrice'];

var data_options = [
            {name: 'All', symbol: ''},
            {name: 'Flat/Maisonette', symbol: 'FlatMaisonette'},
            {name: 'Terraced', symbol: 'Terraced'},
            {name: 'Semi Detached', symbol: 'SemiDetached'},
            {name: 'Detached', symbol: 'Detached'},
            {name: 'Cash', symbol: 'Cash'},
            {name: 'Mortgage', symbol: 'Mortgage'},
            {name: 'First Time Buyer', symbol: 'FirstTimeBuyer'},
            {name: 'Former Owner', symbol: 'FormerOwnerOccupier'},
            {name: 'Existing Property', symbol: 'ExistingProperty'},
            {name: 'New Build', symbol: 'NewBuild'},
];

var other_options = [
    {name: 'Sales Volume', symbol: 'salesVolume'}
];

var data_indicators = [
    {name: 'Average Price', symbol: 'averagePrice', option: data_options},
    {name: 'House Price Index', symbol: 'housePriceIndex', option: data_options},
    {name: 'Monthly Change (%)', symbol: 'percentageChange', option: data_options},
    {name: 'Annual Change (%)', symbol: 'percentageAnnualChange', option: data_options},
    {name: 'Others', symbol: '', option: other_options}
];

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
        var option_table = $('<table class="table"></table>');
        data_indicators.forEach(function(item) {
            var tr = $('<tr><td class="option-table" style="width: 140px;">'+ item.name +'</td></tr>')
            var td = $('<td class="option-table"></td>');
            item.option.forEach(function(subitem){
                var full_symbol = item.symbol + subitem.symbol;
                var element_id = 'option_' + full_symbol + '_selected';
                opt_btn = $("<span class='label label-primary option-label clickable'>" + subitem.name +  "</span>");
                opt_btn.attr("id", element_id);
                if (selected_option.indexOf(full_symbol) != -1) {
                    opt_btn.on('click', function() {
                        delete_from_option_list(full_symbol);
                        display_options();
                    });           
                } else {
                    opt_btn.css('background-color', '#aaaaaa');
                    opt_btn.on('click', function() {
                        add_to_option_list(full_symbol);
                        display_options();
                    });
                }
                td.append(opt_btn);
            });
            tr.append(td);
            option_table.append(tr);
        });
        $('#option-container').append(option_table);
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
        $( "#region-search" ).autocomplete({
            source: result,
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
