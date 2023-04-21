const express = require('express');
const mongoose = require('mongoose');

const { PORT, DEFAULT_ERROR_MESSAGE, STATUS_NOT_FOUND } = require('./config');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6441341fc4f713e567974122',
  };

  next();
});
app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: DEFAULT_ERROR_MESSAGE });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
