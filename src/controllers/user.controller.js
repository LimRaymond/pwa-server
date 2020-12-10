const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const config = require('../../config/config.json');
const webpush = require('web-push');

const { translate } = require('../utils/utils');

async function register(req, res) {
  const lang = req.acceptsLanguages();
  if (
    await User.findOne({
      username: { $regex: `^${req.body.username}$`, $options: 'i' },
    })
  ) {
    return res
      .status(400)
      .json({ message: translate('ERROR_USERNAME_EXIST', lang) });
  }
  if (await User.findOne({ email: req.body.email.toLowerCase() })) {
    return res
      .status(400)
      .json({ message: translate('ERROR_EMAIL_EXIST', lang) });
  }

  const hash = await bcrypt.hash(req.body.password, 10);

  const newuser = new User({
    username: req.body.username,
    password: hash,
    email: req.body.email.toLowerCase(),
  });

  await newuser.save();

  return res.status(201).json({ message: translate('USER_CREATED', lang) });
}

async function login(req, res) {
  const lang = req.acceptsLanguages();
  const user = await User.findOne({ username: req.body.username });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res
      .status(400)
      .json({ message: translate('ERROR_INVALID_CREDENTIALS', lang) });
  }
  if (user.is_ban) {
    return res.status(400).json({ message: translate('ERROR_BANNED', lang) });
  }

  const newtoken = jwt.sign(user._id.toHexString(), config.JWT_SECRET);
  await User.updateOne({ _id: user._id }, { token: newtoken });

  return res
    .status(200)
    .cookie('auth', newtoken)
    .json({
      message: translate('SUCCESSFUL_LOGIN', lang),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        is_mute: user.is_mute,
        is_ban: user.is_ban,
        token: newtoken,
      },
    });
}

async function logout(req, res) {
  const lang = req.acceptsLanguages();
  await User.updateOne({ _id: req.user._id }, { $unset: { token: 1 } });
  return res
    .status(200)
    .json({ message: translate('SUCCESSFUL LOGOUT', lang) });
}

async function profile(req, res) {
  return res.status(200).json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      is_admin: req.user.is_admin,
      is_mute: req.user.is_mute,
      is_ban: req.user.is_ban,
      token: req.user.token,
    },
  });
}

async function editProfile(req, res) {
  const lang = req.acceptsLanguages();
  const updates = req.body;

  if (
    updates.username &&
    (await User.findOne({
      username: { $regex: `^${updates.username}$`, $options: 'i' },
    }))
  ) {
    return res
      .status(400)
      .json({ message: translate('ERROR_USERNAME_EXIST', lang) });
  }
  if (updates.email) {
    updates.email = updates.email.toLowerCase();
    if (await User.findOne({ email: updates.email })) {
      return res
        .status(400)
        .json({ message: translate('ERROR_EMAIL_EXIST', lang) });
    }
  }

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }
  await User.updateOne({ _id: req.user._id }, updates);
  return res.status(200).json({ message: translate('PROFILE_UPDATED', lang) });
}

exports.register = register;
exports.login = login;
exports.logout = logout;
exports.profile = profile;
exports.editProfile = editProfile;
