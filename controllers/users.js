/* eslint-disable consistent-return */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { SECRET_KEY } = require('../config');
const BadRequestError = require('../utils/errors/BadRequestError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ConflictError = require('../utils/errors/ConflictError');

const login = (req, res, next) => {
  if (!req.body) {
    throw new BadRequestError();
  }

  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError();
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
        expiresIn: '7d',
      });
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: true,
      }); // httpOnly кука с токеном
      res.status(200).json({ message: 'Login successful!' });
    })
    .catch(() => {
      next(new UnauthorizedError());
    });
};

const getUserMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      res.status(200).json({ data: user });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).json({ data: users });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      }
      res.status(200).json({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Если произошла ошибка приведения типов, выбрасываем BadRequestError
        next(new BadRequestError());
      } else {
        // В противном случае передаем ошибку дальше
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  if (!req.body) {
    throw new BadRequestError();
  }
  // eslint-disable-next-line object-curly-newline
  const { email, password, name, about, avatar } = req.body;

  if (!email || !password) {
    throw new BadRequestError();
  }

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
    )
    .then((user) => {
      res.status(201).json({ data: user });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError());
      } else if (e.code === 11000) {
        next(new ConflictError());
      }
      next();
    });
};

const updateUser = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => {
      res.status(200).json({ data: user });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError());
      }
      next();
    });
};

const updateAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => {
      res.status(200).json({ data: user });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError());
      }
      next();
    });
};

module.exports = {
  login,
  getUser,
  getUsers,
  getUserMe,
  createUser,
  updateUser,
  updateAvatar,
};
