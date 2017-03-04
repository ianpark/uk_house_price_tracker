

var modals = {
    progress: '\
        <div id="in_progress_dlg" class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" data-backdrop="static" data-keyboard="false">\
            <div class="modal-dialog" style="width: 300px">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                        <h4 class="modal-title">Loading data...</h4>\
                    </div>\
                    <div id="modal_message_body" class="modal-body">\
                        <div class="progress">\
                            <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%">\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>',
    warning: '\
        <div id="message_dlg" class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" data-backdrop="static" data-keyboard="false">\
            <div class="modal-dialog" style="width: 400px">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                        <h4 class="modal-title">Warning</h4>\
                    </div>\
                    <div id="modal_message_body" class="modal-body">\
                    </div>\
                </div>\
            </div>\
        </div>',
    info: '\
        <div id="info_dlg" class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false">\
            <div class="modal-dialog" style="width: 400px">\
                <div class="modal-content">\
                    <div id="modal_message_body" class="modal-body"></div>\
                </div>\
            </div>\
        </div>'
};

function get_modal(name) {
    m = $(modals[name]);
    m.msg = function (message) {
        this.find('.modal-body').text(message);
        this.modal('show');
        return this;
    };
    m.show = function () {
        this.modal('show');
        return this;
    };
    m.hide = function () {
        this.modal('hide');
        return this;
    };
    return m;
}
