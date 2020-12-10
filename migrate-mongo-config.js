module.exports = {
  mongodb: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/unptitfive',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // The migrations dir, can be an relative or absolute path.
  migrationsDir: 'migrations',

  // The mongodb collection where the applied changes are stored.
  changelogCollectionName: 'changelog',

  // The file extension to create migrations and search for in migration dir.
  migrationFileExtension: '.js',
};
