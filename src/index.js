const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const router = require('./router');
const { port } = require('./config');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} at ${new Date()}`);
  next();
});

app.use(router);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500);
  return res.end({
    message: 'Hiba tortent',
  });
});

app.listen(port, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Az alkalmazas a következő URL-en érhető el: http://localhost:${port}`);
});
