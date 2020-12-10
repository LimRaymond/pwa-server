const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../../config/config.json');
const translations = require('./translations.json');

function translate(msgCode, lang, ...args) {
  if (!translations[msgCode]) return '';

  // Use only the first two characters in lang code
  const langSub = [];
  lang.forEach((l) => {
    langSub.push(l.substring(0, 2));
  });
  lang = langSub;

  // Select the appropriate language code
  const knownLang = Object.keys(translations[msgCode]);
  let translation = translations[msgCode][knownLang[0]];

  const inter = lang.filter((e) => knownLang.includes(e));
  if (inter.length) {
    translation = translations[msgCode][inter[0]];
  }

  // Replace args in translation string
  args.forEach((arg) => {
    translation = translation.replace('{$}', arg);
  });
  return (translation);
}

function getUserByToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.JWT_SECRET, (err, decode) => {
      if (err) reject(err);
      User.findOne({ _id: decode, token }, (err2, user) => {
        if (err2) reject(err2);
        resolve(user);
      });
    });
  });
}

function convertDate(str) {
  const date = new Date(str);
  const year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  month = (month < 10) ? `0${month}` : month;
  day = (day < 10) ? `0${day}` : day;
  hours = (hours < 10) ? `0${hours}` : hours;
  minutes = (minutes < 10) ? `0${minutes}` : minutes;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date.getTime() >= today.getTime()) {
    return (`${hours}:${minutes}`);
  }
  if ((date.getTime() < today.getTime())
    && (date.getTime() >= today.getTime() - (24 * 60 * 60 * 1000))) {
    return (`Hier ${hours}:${minutes}`);
  }
  return (`${day}/${month}/${year} ${hours}:${minutes}`);
}

exports.translate = translate;
exports.getUserByToken = getUserByToken;
exports.convertDate = convertDate;
