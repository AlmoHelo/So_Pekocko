const jwt = require('jsonwebtoken');

//A chaque requête sur une route protégée on passe d'abord par ce middleware
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'hoiBBF565dsBJk56ampMbjfe5263MKB523fezbkknkPAfbkND6326HKZBJlldsnkclfezigb5526s64gzsjojDZ65dsDZc');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};