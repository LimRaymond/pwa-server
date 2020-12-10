module.exports = {
  async up(db) {
    await db.collection('users').updateMany({}, { $set: { picture: 'test' } });
  },

  async down(db) {
    await db.collection('users').updateMany({}, { $unset: { picture: '' } });
  },
};
