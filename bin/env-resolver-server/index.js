#!/usr/bin/env node

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes');
const config = require('../../config');

const port = (process.env.PORT || config.envResolverPort || 9999);
const app = express();

app.disable('x-powered-by');

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .send(JSON.stringify({ error: err.message }));
});

app.listen(port, () => console.log(`Listening on port ${port}`));