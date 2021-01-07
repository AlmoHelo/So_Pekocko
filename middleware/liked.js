const Sauce = require('../models/Sauce');

module.exports = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like == 1 && sauce.usersLiked.indexOf(req.body.userId) < 0) {
                sauce.usersLiked.push(req.body.userId);
                sauce.likes += 1;
            } else if (req.body.like == -1 && sauce.usersDisliked.indexOf(req.body.userId) < 0) {
                sauce.usersDisliked.push(req.body.userId);
                sauce.dislikes += 1;
            } else {
                sauce.usersLiked.forEach(element => {
                    if (element == req.body.userId) {
                        sauce.likes -= 1;
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
                    }
                });
                sauce.usersDisliked.forEach(element => {
                    if (element == req.body.userId) {
                        sauce.dislikes -= 1;
                        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1);
                    }
                });
            }
            req.body.sauce = sauce;
            next();
        })
        .catch(error => res.status(400).json({ error: "Une erreur est survenue lors de l'analyse des données!" }));
}