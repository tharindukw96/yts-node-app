const express = require('express');
const app = express();
const movieRoute = require('./route/movie');
const bodyparser = require('body-parser');
app.set('view engine', 'pug');
app.set('views', './views');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());

app.use('/movies/',movieRoute);


module.exports = app;