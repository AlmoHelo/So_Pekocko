const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/', auth, multer, sauceCtrl.create);
router.put('/:id', auth, multer, sauceCtrl.modify);
router.delete('/:id', auth, sauceCtrl.delete);
router.get('/:id', auth, sauceCtrl.getOne);
router.get('/', auth, sauceCtrl.getAll);
router.post('/:id/like', auth, sauceCtrl.like);   //route like-dislike 

module.exports = router;