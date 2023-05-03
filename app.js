const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');

const { DATABASE_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const { PORT, STATUS_NOT_FOUND } = require('./config');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

mongoose.connect(DATABASE_URL);

const app = express();
app.use(cookieParser());

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

app.use(express.json());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);

app.use(auth, userRouter);
app.use(auth, cardRouter);
app.use('*', (req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Page not found' });
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
