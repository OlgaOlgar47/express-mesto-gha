/* eslint-disable no-else-return */
const {
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_FORBITTEN,
  STATUS_NOT_FOUND,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
} = require('../config');

const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const ForbittenError = require('../utils/errors/ForbittenError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.log('work!');
  if (err.code === 11000) {
    res.status(STATUS_CONFLICT).json({ message: 'Email is already exist' });
    return;
  } else if (err instanceof UnauthorizedError) {
    res
      .status(STATUS_UNAUTHORIZED)
      .json({ message: 'Неправильные почта или пароль' });
    return;
  } else if (err instanceof BadRequestError) {
    res.status(STATUS_BAD_REQUEST).json({ message: err.message });
    return;
  } else if (err instanceof NotFoundError) {
    res.status(STATUS_NOT_FOUND).json({ message: 'Not found' });
    return;
  } else if (err instanceof ForbittenError) {
    res
      .status(STATUS_FORBITTEN)
      .json({ message: 'You cannot delete others user card' });
    return;
  }
  res
    .status(STATUS_INTERNAL_SERVER_ERROR)
    .json({ message: DEFAULT_ERROR_MESSAGE });
};

module.exports = errorHandler;
