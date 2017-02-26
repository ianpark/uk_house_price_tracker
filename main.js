'use strict'

var express = require("express");
var app = express();

var fs = require('fs'),
    Q = require('q'),
    data_handler = require(__dirname + '/data_handler');

app.use(express.static('static'))
app.get("/", function(req, res) {
      res.sendFile(__dirname + "/static/html/viewer.html");
});

app.get("/region/:name", function(req, res) {
      let region_name = req.params.name;
      data_handler.populate_region_data_json(region_name)
      .then(function(info) {
            res.send(info);
      })
      .catch(function(error) {
            console.log('Get ' + region_name + ': ' + error);
            res.status(400)
            .json({error: 'no data'})
      })
      .done();
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res){ 
      console.log('static file request : ' + req.params);
      res.sendfile( __dirname + req.params[0]); 
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
      console.log("Listening on " + port);
});
