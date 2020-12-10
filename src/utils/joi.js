const Joi = require('joi');
const { translate } = require('./utils');

// Joi Override Error Messages

const customString = (lang) => Joi.string()
  .messages({
    'string.base': translate('ERROR_STRING_INVALID', lang, '{#label}'),
    'string.empty': translate('ERROR_STRING_EMPTY', lang, '{#label}'),
    'string.email': translate('ERROR_EMAIL_INVALID', lang, '{#label}'),
    'string.pattern.base': translate('ERROR_REGEX_MISMATCH', lang, '{#label}', '{#regex}'),
    'string.alphanum': translate('ERROR_STRING_ALPHANUM', lang, '{#label}'),
    'string.min': translate('ERROR_STRING_MIN', lang, '{#label}', '{#limit}'),
    'string.max': translate('ERROR_STRING_MAX', lang, '{#label}', '{#limit}'),
    'any.required': translate('ERROR_REQUIRED', lang, '{#label}'),
  });

const customObject = (lang) => Joi.object()
  .messages({
    'object.unknown': translate('ERROR_NOT_ALLOWED', lang, '{#label}'),
    'object.min': 'Not enough key provided (min: {#limit})',
  });

exports.customString = customString;
exports.customObject = customObject;
