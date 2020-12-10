const channel = require('./channel.routes');
const message = require('./message.routes');
const user = require('./user.routes');

exports.routes = [
  { name: '/channel', router: channel },
  { name: '/message', router: message },
  { name: '/user', router: user },
];
