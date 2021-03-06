const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize');
const crypt = require('crypto-js');
require('dotenv').config()

//requête inscription
exports.signup = (req, res, next) => {
    const email = sanitize(req.body.email);         //nettoie les entrées 
    const password = sanitize(req.body.password);
    const cryptoEmail = crypt.MD5(email).toString();

    bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                email: cryptoEmail,
                password: hash                      //hashage du mot de passe   
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//requête identification
exports.login = (req, res, next) => {
    const email = sanitize(req.body.email);
    const password = sanitize(req.body.password);
    const cryptoEmail = crypt.MD5(email).toString();

    User.findOne({ email: cryptoEmail })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.DB_TOKEN,      //chaîne aléatoire pour encoder token
                            { expiresIn: '2h' }         //durée de validité du token
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};