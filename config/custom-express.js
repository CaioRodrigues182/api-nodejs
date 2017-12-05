var express = require('express');
var consign = require('consign');
var bodyparser = require('body-parser');
var expressValidator = require('express-validator');

module.exports = function() {
    var app = express();

    app.use(bodyparser.urlencoded({extend: true}));
    app.use(bodyparser.json());

    app.use(expressValidator());

    consign()
    .include('controllers')
    .then('persistencia')
    .into(app) 

    return app;
}