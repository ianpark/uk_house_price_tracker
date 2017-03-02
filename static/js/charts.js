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
    if (idx_begin == -1) { idx_begin = 0; }
    var idx_end = region_data[detail.region[0]].refMonth.indexOf(detail.period[1], idx_begin);
    if (idx_end == -1) { idx_end = region_data[detail.region[0]].refMonth.length;}
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
                data: region_data[region_name][data_name].slice(idx_begin, idx_end + 1)
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
        labels: region_data[detail.region[0]].refMonth.slice(idx_begin, idx_end + 1),
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
            display: false,
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
    var chart_head_message = detail.region.join(' ') + " | " +
                         detail.data.join(' ') + " | " + detail.period.join('_');
    var chart_id = "hpc_chart_" + chart_id_sequence++;
    var canvas_id = "canvas_" + chart_id;
    var chart_panel = $("<div id='" + chart_id + "' class='row chart-panel'></div>");
    var chart_panel_head = $("<div class='chart-panel-head'> " + chart_head_message + "</div>");
    var close_icon = $("<span class='glyphicon glyphicon-remove-sign clickable' aria-hidden='true' style='color: #992222;'></span>");
    close_icon.on('click', function () {
        $('#'+chart_id).slideUp("fast", function() {
            $('#'+chart_id).remove();
        });
    });
    var capture_icon = $("<span class='glyphicon glyphicon-camera clickable' aria-hidden='true' style='color: #045FB4;'></span>");
    capture_icon.on('click', function () {
        var canvas = document.getElementById(canvas_id);
        $('#hidden_drawing_area').html('');
        $('#hidden_drawing_area').append($('<div id="tmp_image_frame"><img src="'+canvas.toDataURL                                     ("image/png") + '"/></div>'));
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
        range.selectNode(document.getElementById("tmp_image_frame"));
        sel.addRange(range);
        // copy
        document.execCommand("copy");
        $('#hidden_drawing_area').html('');
        $('#info_dlg').find('.modal-body').text("Copied to clipboard. Use ctrl-v to paste in any text area.");
        $('#info_dlg').modal('show');
    });
    var download_icon = $("<span class='glyphicon glyphicon-download clickable' aria-hidden='true' style='color: #4B610B;'></span>");
    download_icon.on('click', function() {
        var canvas = document.getElementById(canvas_id);
        var a = $('<a>')
            .attr("href", canvas.toDataURL('image/png'))
            .attr("download", "chart.png")
            .appendTo("body");
        a[0].click();
        a.remove();
    });

    chart_panel_head.prepend(capture_icon);
    chart_panel_head.prepend(download_icon);
    chart_panel_head.prepend(close_icon);
    chart_panel.append(chart_panel_head);
    // Create a new canvas and add to the panel to activate it
    var new_canvas = $("<canvas id='" + canvas_id + "'></canvas>");
    chart_panel.append($("<div style='height: 400px;'></div>").append(new_canvas));
    chart_panel.prependTo($('#chart-ground')).slideDown("fast");
    //$('#chart-ground').prepend(chart_panel);

    var hpc_chart = new Chart(new_canvas, {
        type: 'line',
        data: chart_data,
        options: options
    });

    $.ajax({type: "POST",
            url: '/api/log/action',
            data: JSON.stringify({type: 'create-chart',
                   detail: chart_head_message}),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function() {}});
}

