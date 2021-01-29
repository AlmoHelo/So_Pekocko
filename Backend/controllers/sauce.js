const Sauce = require('../models/Sauce');
const fs = require('fs');
const sanitize = require('mongo-sanitize');

//récupération d'une sauce
exports.getOne = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//récupération de toutes les sauces
exports.getAll = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//création d'une sauce
exports.create = (req, res, next) => {
    const sauceNettoyée = sanitize(req.body.sauce); 
    const sauceObject = JSON.parse(sauceNettoyée);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

//modification d'une sauce
exports.modify = (req, res, next) => {
    const sauceNettoyée = sanitize(req.body.sauce); 
    const sauceObject = req.file ?
        {
            ...JSON.parse(sauceNettoyée),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

//suppression d'une sauce
exports.delete = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};



exports.like = (req, res, next) => {
    const likeSauce = req.body.like;
    const userId = sanitize(req.body.userId); 
    const id = req.params.id;

    Sauce.findOne({ _id: id })
        .then(sauce => {
            switch (likeSauce) {
                case 1: // if user like the sauce  
                    if (sauce.usersLiked.includes(userId) !== 'undefined') {  //on vérifie si le user n'a pas like déja cet sauce
                        Sauce.updateOne({ _id: id },
                            {
                                $inc: { likes: 1 },
                                $push: { usersLiked: userId },
                                _id: id
                            })
                            // on incremente like et en push the userId dans le tableau usersLiked
                            .then(() => res.status(201).json({ message: 'Like ajouté avec succès !' }))
                            .catch(error => res.status(410).json({ error }));
                    }
                    break;

                case -1: // if user Dislike the sauce 
                    if (sauce.usersDisliked.includes(userId) !== 'undefined') {  //on vérifie si le user n'a pas Dislike déja cet sauce
                        Sauce.updateOne({ _id: id },
                            {
                                $inc: { dislikes: 1 },
                                $push: { usersDisliked: userId },
                                _id: id
                            })
                            // on incremente dislike et en push the userId dans le tableau usersDisLiked
                            .then(() => res.status(201).json({ message: 'DisLike ajouté avec suucès !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;

                case 0:
                    if (sauce.usersLiked.includes(userId)) {  //on vérife si le user a like déja cet sauce
                        Sauce.updateOne({ _id: id }, { $inc: { likes: -1 }, $pull: { usersLiked: userId }, _id: id })
                            // on enléve le like et en eléve users'Id du tableau usersLiked
                            .then(() => res.status(201).json({ message: 'like annulé avec succès !' }))
                            .catch(error => res.status(400).json({ error }));
                    } else if (sauce.usersDisliked.includes(userId)) { // si le user a Dislike déja cet sauce
                        Sauce.updateOne({ _id: id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId }, _id: id })
                            // on enléve le Dislike et en eléve users'Id du tableau sersDisliked
                            .then(() => res.status(201).json({ message: 'Dislike annulé avec succès !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;

                default:
                    throw ("impossible de réagir sur cet sauce reéssayer plus tard !")  // on envoie l'exeption
            }
        })
        .catch(error => res.status(400).json({ error }));
};