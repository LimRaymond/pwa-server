const router = require('express').Router();
const controller = require('../controllers/user.controller');
const validator = require('../controllers/user.validator');
const auth = require('../middlewares/auth');

router.post('/register', validator.register, controller.register);
router.post('/login', validator.login, controller.login);
router.get('/logout', auth, controller.logout);
router.get('/profile', auth, controller.profile);
router.post('/profile', auth, validator.editProfile, controller.editProfile);

module.exports = router;
