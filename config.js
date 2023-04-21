const { PORT = 3000 } = process.env;
const STATUS_BAD_REQUEST = 400;
const STATUS_NOT_FOUND = 404;
const STATUS_INTERNAL_SERVER_ERROR = 500;
const DEFAULT_ERROR_MESSAGE = 'An unexpected error has occurred';

module.exports = {
  PORT,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
};