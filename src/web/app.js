const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { privateRouter, publicRouter } = require('./router');
const logger = require('../logger');

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(helmet());

app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url} at ${new Date()}`);
  next();
});

app.use(publicRouter);
app.use(privateRouter);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500);
  return res.end({
    message: 'Hiba tortent',
  });
});

module.exports = app;
