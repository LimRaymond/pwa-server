const Channel = require('../models/channel.model');
const Message = require('../models/message.model');
const { translate, getUserByToken, convertDate } = require('../utils/utils');

function startSocket(io) {
  io.use(async (socket, next) => {
    let lang = [];
    if (socket.handshake.query && socket.handshake.query.lang) {
      lang = socket.handshake.query.lang.split(',');
    }
    if (socket.handshake.query && socket.handshake.query.token) {
      try {
        const user = await getUserByToken(socket.handshake.query.token);
        if (!user) return next(new Error('Authentication error'));
        socket.user = user;
        socket.channel = null;
        socket.lang = lang;
        return next();
      } catch {
        return next(new Error('Authentication error'));
      }
    }
    return next(new Error('Authentication error'));
  });

  io.sockets.on('connection', (socket) => {
    socket.on('join', async (channelName) => {
      const channel = await Channel.findOne({ name: channelName });
      if (channel && !(socket.channel && socket.channel.name === channelName)) {
        // Leave the old channel
        if (socket.channel) {
          socket.leave(socket.channel.name, () => {
            io.in(socket.channel.name).emit('info', {
              message: translate('HAS_LEFT_CHANNEL', socket.lang, socket.user.username),
              color: 'teal',
            });
            // And then join the new channel
            socket.channel = channel;
            socket.join(channel.name, () => {
              io.in(socket.channel.name).emit('info', {
                message: translate('HAS_JOINED_CHANNEL', socket.lang, socket.user.username),
                color: 'teal',
              });
            });
          });
        } else {
          // Join the new channel
          socket.channel = channel;
          socket.join(channel.name, () => {
            io.in(socket.channel.name).emit('info', {
              message: translate('HAS_JOINED_CHANNEL', socket.lang, socket.user.username),
              color: 'teal',
            });
          });
        }
      }
    });

    socket.on('message', async (message) => {
      if (socket.channel) {
        // Save message in database
        const newmessage = new Message({
          message,
          user: socket.user._id,
          channel: socket.channel._id,
        });
        const res = await newmessage.save();

        // Broadcast message
        io.in(socket.channel.name).emit('message', {
          username: socket.user.username,
          message,
          date: convertDate(res.date),
        });
      }
    });

    socket.on('disconnect', () => {
      if (socket.channel) {
        io.in(socket.channel.name).emit('info', {
          message: translate('HAS_LEFT_CHANNEL', socket.lang, socket.user.username),
          color: 'teal',
        });
        socket.channel = null;
      }
    });
  });
}

module.exports = startSocket;
