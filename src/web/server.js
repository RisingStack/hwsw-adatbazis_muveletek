const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { promisify } = require('util');
const http = require('http');
const { privateRouter, publicRouter } = require('./router');
const { port } = require('../config');
const logger = require('../logger');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(helmet());

app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url} at ${new Date()}`);
  next();
});

app.use(publicEndpoint);
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

const listenPromise = promisify(server.listen.bind(server, port));

module.exports = {
  init: listenPromise,
};
