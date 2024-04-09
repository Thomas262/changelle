const express = require('express');
const path = require('path');
const session = require('express-session');

const indexRouter = require('./routes/index');

const userRoutes = require('./routes/users');
const app = express();

app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, '../public')));

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false
  }));

app.use('/', indexRouter);

app.use(userRoutes);

app.listen('3001', () => console.log('Servidor corriendo en el puerto 3001'));
