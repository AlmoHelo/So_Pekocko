const multer = require('multer');

//nous permet de gérer les fichiers entrants
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {     //indique la destination des fichiers
        callback(null, 'images');
    },
    filename: (req, file, callback) => {                        //utilise le nom d'origine et remplace les espaces par des underscores et ajouter un timestamp
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');