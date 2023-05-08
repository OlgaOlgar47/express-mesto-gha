/* eslint-disable consistent-return */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const {
  SECRET_KEY,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
  STATUS_CONFLICT,
} = require('../config');
const BadRequestError = require('../utils/errors/BadRequestError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const NotFoundError = require('../utils/errors/NotFoundError');

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
    .catch(() => {
      next(new BadRequestError());
    });
};

const createUser = (req, res) => {
  if (!req.body) {
    res.status(STATUS_BAD_REQUEST).json({ message: 'invalid body request' });
    return;
  }
  // eslint-disable-next-line object-curly-newline
  const { email, password, name, about, avatar } = req.body;

  if (!email || !password) {
    res.status(
      STATUS_BAD_REQUEST.json({ message: 'email or password is required' })
    );
    return;
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
      console.log(e);
      if (e.name === 'ValidationError') {
        const message = Object.values(e.errors)
          .map((err) => err.message)
          .join('; ');
        res.status(STATUS_BAD_REQUEST).json({ message });
      } else if (e.code === 11000) {
        res
          .status(STATUS_CONFLICT)
          .json({ message: 'Такой email уже существует' });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .json({ message: DEFAULT_ERROR_MESSAGE });
      }
    });
};

const updateUser = (req, res) => {
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
      throw new Error('Not found');
    })
    .then((user) => {
      res.status(200).json({ data: user });
    })
    .catch((e) => {
      const message = Object.values(e.errors)
        .map((err) => err.message)
        .join('; ');
      if (e.message === 'Not found') {
        res.status(STATUS_NOT_FOUND).json({ message: 'User not found' });
      } else if (e.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).json({ message });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .json({ message: DEFAULT_ERROR_MESSAGE });
      }
    });
};

const updateAvatar = (req, res) => {
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
      throw new Error('Not found');
    })
    .then((user) => {
      res.status(200).json({ data: user });
    })
    .catch((e) => {
      const message = Object.values(e.errors)
        .map((err) => err.message)
        .join('; ');
      if (e.message === 'Not found') {
        res.status(STATUS_NOT_FOUND).json({ message: 'User not found' });
      } else if (e.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).json({ message });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .json({ message: DEFAULT_ERROR_MESSAGE });
      }
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
