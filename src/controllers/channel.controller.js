const Channel = require('../models/channel.model');
const { translate } = require('../utils/utils');

async function getChannels(req, res) {
  const channels = await Channel.find();

  return res.status(200).json(channels);
}

async function createChannel(req, res) {
  const lang = req.acceptsLanguages();

  if (!req.user.is_admin) {
    return res.status(400).json({ message: translate('ERROR_UNAUTHORIZED', lang) });
  }

  if (!req.body.name) {
    return res.status(400).json({ message: translate('ERROR_REQUIRED', lang, 'name') });
  }

  if (await Channel.findOne({ name: { $regex: `^${req.body.name}$`, $options: 'i' } })) {
    return res.status(400).json({ message: translate('ERROR_CHANNEL_EXIST', lang) });
  }

  const newchannel = new Channel({
    name: req.body.name,
  });

  await newchannel.save();

  return res.status(201).json({ message: translate('CHANNEL_CREATED', lang) });
}

async function deleteChannel(req, res) {
  const lang = req.acceptsLanguages();

  if (!req.user.is_admin) {
    return res.status(400).json({ message: translate('ERROR_UNAUTHORIZED', lang) });
  }

  if (!req.params.channel_id) {
    return res.status(400).json({ message: translate('ERROR_REQUIRED', lang, 'channel_id') });
  }

  try {
    await Channel.deleteOne({ _id: req.params.channel_id });
    return res.status(200).json({ message: translate('CHANNEL_DELETED', lang) });
  } catch (error) {
    return res.status(400).json({ message: translate('ERROR_STRING_INVALID', lang, 'channel_id') });
  }
}

exports.getChannels = getChannels;
exports.createChannel = createChannel;
exports.deleteChannel = deleteChannel;
