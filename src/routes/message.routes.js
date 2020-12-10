const router = require('express').Router();
const controller = require('../controllers/message.controller');
const auth = require('../middlewares/auth');

router.get('/:channel_name?', auth, controller.getMessages);

module.exports = router;
