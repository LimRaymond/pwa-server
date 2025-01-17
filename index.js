const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./src/routes');
const startSocket = require('./src/socket');
const { translate } = require('./src/utils/utils');
const dotenv = require('dotenv');
const webpush = require('web-push');

const port = process.env.PORT || 8080;
const db = process.env.DATABASE_URL || 'mongodb://localhost:27017/unptitfive';

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyparser.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'https://epi-pwa-front.herokuapp.com/',
    ],
  }),
);

webpush.setVapidDetails(
  'mailto: corentin@outlook.com',
  'BOdvGk6xgnopGw-QOw3QYp0LGmKPuoWSRLaxtiG-AVxsUcORkHcgDpCFS1EEIoki16gAFZcOICin5QOfGb67m_k',
  'nPL9HYhcZWVZcyJmobSad7SLZcStuXfZLDSymnNxb38',
);

routes.routes.forEach((r) => {
  app.use(r.name, r.router);
});

app.post('/notifications/subscribe', (req, res) => {
  const subscription = req.body;
  const payload = {
    title: 'testing',
    body: 'success',
  };

  console.log(subscription);

  webpush
    .sendNotification(subscription, JSON.stringify(payload))
    .then((result) => console.log(result))
    .catch((e) => console.log(e.stack));

  res.status(200).json({ success: true });
});

// app.listen(port);

// // Handle Error 404
// app.use((req, res) => {
//   const lang = req.acceptsLanguages();
//   res.status(404).json({ message: translate('ERROR_404', lang) });
// });

startSocket(io);

server.listen(port, () => {
  console.log(`Server running at PORT = ${port}`);
});
