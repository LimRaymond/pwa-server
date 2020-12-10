const router = require('express').Router();
const controller = require('../controllers/channel.controller');
const auth = require('../middlewares/auth');

router.get('/', auth, controller.getChannels);
router.post('/', auth, controller.createChannel);
router.delete('/:channel_id', auth, controller.deleteChannel);

module.exports = router;
