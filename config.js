const { PORT = 3000 } = process.env;
const { DATABASE_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const STATUS_BAD_REQUEST = 400;
const STATUS_NOT_FOUND = 404;
const STATUS_INTERNAL_SERVER_ERROR = 500;
const DEFAULT_ERROR_MESSAGE = 'На сервере произошла ошибка';

module.exports = {
  PORT,
  DATABASE_URL,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
};
