const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const {
    fileParser
} = require('express-multipart-file-parser');
const express = require("express");
const expressValidator = require('express-validator');

module.exports = function (app) {
    app.use(express.json());
    app.use(fileParser({
        rawBodyOptions: {
            limit: '30mb', //file size limit
        },
        busboyOptions: {
            limits: {
                fields: 50 //Number text fields allowed 
            }
        }
    }));
    // sanitize request data
    // set security HTTP headers
    app.use(helmet());
    app.use(xss());
    app.use(mongoSanitize());

    // gzip compression
    app.use(compression());
    app.use(cors());
    app.options('*', cors());

    app.enable('trust proxy');
}