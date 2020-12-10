const Message = require('../models/message.model');
const Channel = require('../models/channel.model');
const { translate } = require('../utils/utils');

async function getMessages(req, res) {
  const lang = req.acceptsLanguages();
  if (req.params.channel_name) {
    const channel = await Channel.findOne({ name: req.params.channel_name });
    if (channel) {
      const messages = await Message.find({ channel: channel.id }).populate('user', 'username');
      return res.status(200).json(messages);
    }
    return res.status(400).json({ message: translate('ERROR_STRING_INVALID', lang, 'channel_name') });
  }
  const messages = await Message.find();
  return res.status(200).json(messages);
}

exports.getMessages = getMessages;
