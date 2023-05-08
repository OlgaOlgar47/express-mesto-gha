const {
  STATUS_INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
} = require('../config');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { statusCode = STATUS_INTERNAL_SERVER_ERROR } = err;
  // eslint-disable-next-line operator-linebreak
  const message =
    statusCode === STATUS_INTERNAL_SERVER_ERROR
      ? DEFAULT_ERROR_MESSAGE
      : err.message;

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
