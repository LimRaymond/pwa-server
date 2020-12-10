const Joi = require('joi');
const { customString, customObject } = require('../utils/joi');
const { translate } = require('../utils/utils');

async function register(req, res, next) {
  try {
    const lang = req.acceptsLanguages();

    const registerSchema = customObject(lang).append({
      username: customString(lang).alphanum().min(3).max(30)
        .required(),
      password: customString(lang).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      password2: Joi.valid(Joi.ref('password')).messages({ 'any.only': translate('ERROR_PASSWORD_MISMATCH', lang) }),
      email: customString(lang).email().required(),
    });

    await registerSchema.validateAsync(req.body);

    return next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function login(req, res, next) {
  try {
    const lang = req.acceptsLanguages();

    const loginSchema = customObject(lang).append({
      username: customString(lang).required(),
      password: customString(lang).required(),
    });

    await loginSchema.validateAsync(req.body);

    return next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function editProfile(req, res, next) {
  try {
    const lang = req.acceptsLanguages();

    const editProfileSchema = customObject(lang).append({
      username: customString(lang).alphanum().min(3).max(30)
        .optional(),
      password: customString(lang).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).optional(),
      email: customString(lang).email().optional(),
    }).min(1);

    await editProfileSchema.validateAsync(req.body);

    return next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.register = register;
exports.login = login;
exports.editProfile = editProfile;
