const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const session = require('express-session');

const config = require('../../config');
const { expressErrorLogger } = require('../../winston');
const responses = require('../responses');
const EventCreator = require('../services/EventCreator');
const router = require('./routers');
const passport = require('./passport');
const sessionConfig = require('./sessionConfig');

const corsCfg = {
  origin: config.app.adminHostname,
  credentials: true,
};

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  EventCreator.handlerError(req, err);
  if (!res.headersSent) {
    res.error(err);
  }
}

function cacheControl(_req, res, next) {
  res.set('Cache-Control', 'no-store');
  next();
}

const app = express();
app.options('*', cors(corsCfg));
app.use(cors(corsCfg));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(methodOverride());
app.use(cacheControl);
app.use(responses);
app.use(router);
app.use(expressErrorLogger);
app.use(errorHandler);

module.exports = app;
