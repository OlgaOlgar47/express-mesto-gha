const {
  STATUS_INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
} = require('../config');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { statusCode = STATUS_INTERNAL_SERVER_ERROR } = err;
  // eslint-disable-next-line operator-linebreak
  const myMessage =
    statusCode === STATUS_INTERNAL_SERVER_ERROR
      ? DEFAULT_ERROR_MESSAGE
      : err.message;

  res.status(statusCode).json({ message: myMessage });
};

module.exports = errorHandler;
