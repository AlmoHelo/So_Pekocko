const mongoose = require('mongoose');

mongoose.connect(process.env.URL_MONGOOSE,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));