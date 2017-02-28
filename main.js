'use strict'


var fs = require('fs'),
    Q = require('q'),
    logger = require(__dirname + '/lib/logger.js'),
    data_handler = require(__dirname + '/lib/data_handler'),
    express = require('express'),
    bodyParser = require('body-parser');

var app = express();
app.use(express.static('static'));
app.use(bodyParser.json());
app.get('/', function(req, res) {
      res.sendFile(__dirname + "/static/html/viewer.html");
});

app.get('/region/:name', function(req, res) {
      let region_name = req.params.name;
      data_handler.populate_region_data_json(region_name)
      .then(function(info) {
            logger.info({event:'region-data-sent', region_name: region_name});
            res.send(info);
      })
      .catch(function(error) {
            logger.error({event: 'fail-to-get-region-data', region_name: region_name, error: error});
            res.status(400)
            .json({region_name: region_name, error: 'no data'})
      })
      .done();
});

app.post('/api/log/action', function(req, res) {
      logger.info(JSON.stringify(req.body));
      res.status(200);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
      logger.info('Listening on ' + port);
});
