const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { promisify } = require('util');
const http = require('http');
const { port } = require('../config');

const app = require('./app');

const server = http.createServer(app);

const listenPromise = promisify(server.listen.bind(server, port));

function shutdown(cleanup) {
  console.log('Bejovo kapcsolatokat visszautasitjuk');
  server.close(() => {
    console.log('Nincs tobb bejovo kapcsolat');
    cleanup();
  });
}

module.exports = {
  init: listenPromise,
  shutdown,
};
