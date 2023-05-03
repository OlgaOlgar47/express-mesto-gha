const {
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_NOT_FOUND,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
} = require('../config');

const errorHandler = (err, req, res) => {
  console.error(err.stack);

  if (err.code === 11000) {
    res.status(STATUS_CONFLICT).send({ message: 'Email уже зарегистрирован' });
  } else if (err.name === 'UnauthorizedError') {
    res.status(STATUS_UNAUTHORIZED).send({ message: 'Неверный токен' });
  } else if (err.name === 'ValidationError') {
    res.status(STATUS_BAD_REQUEST).send({ message: err.message });
  } else if (err.name === 'NotFoundError') {
    res.status(STATUS_NOT_FOUND).send({ message: 'Не найдено' });
  } else {
    res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: DEFAULT_ERROR_MESSAGE });
  }
};

module.exports = errorHandler;
