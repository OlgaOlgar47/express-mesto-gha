const {
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_NOT_FOUND,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
} = require('../config');

const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const errorHandler = (err, req, res) => {
  if (err.code === 11000) {
    res.status(STATUS_CONFLICT).send({ message: 'Email is already exist' });
  } else if (err instanceof UnauthorizedError) {
    res.status(STATUS_UNAUTHORIZED).send({ message: 'Access denied' });
  } else if (err instanceof BadRequestError) {
    res.status(STATUS_BAD_REQUEST).send({ message: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(STATUS_NOT_FOUND).send({ message: 'Not found' });
  }
  res
    .status(STATUS_INTERNAL_SERVER_ERROR)
    .json({ message: DEFAULT_ERROR_MESSAGE });
};

module.exports = errorHandler;
