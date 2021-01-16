const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

//constante à utiliser avec le package rateLimit
const limiter = rateLimit({         
  windowMs: 15 * 60 * 1000,       // = 15 minutes
  max: 5                          // 5 tentatives
});


const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://almohelo:e7n11m8h4@cluster0.wfjmt.mongodb.net/So_Pekocko?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use(helmet());
app.use(limiter);
app.use(mongoSanitize());

module.exports = app;