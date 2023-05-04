const jwt = require('jsonwebtoken');
const { SECRET_KEY, STATUS_UNAUTHORIZED } = require('../config');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.cookies.jwt; // Получаем токен из куки

  if (!token) {
    return res
      .status(STATUS_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res
      .status(STATUS_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};

module.exports = auth;
