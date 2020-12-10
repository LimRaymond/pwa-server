const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
