/* eslint-disable consistent-return */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const {
  SECRET_KEY,
  STATUS_BAD_REQUEST,
  STATUS_CONFLICT,
  STATUS_UNAUTHORIZED,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
} = require('../config');

const login = (req, res) => {
  if (!req.body) {
    res.status(STATUS_BAD_REQUEST).json({ message: 'invalid body request' });
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(
      STATUS_BAD_REQUEST.json({ message: 'email or password is required' })
    );
    return;
  }

  User.findUserByCredentials(email, password)
    .select('+password')
    .then(() => {
      const token = jwt.sign({ _id: 'd285e3dceed844f902650f40' }, SECRET_KEY, {
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
      res.status(STATUS_UNAUTHORIZED).json({ message: 'Ошибка авторизации' });
    });
};

const getUserMe = (req, res) => {
  console.log('work');
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      res.status(200).json({ data: user });
    })
    .catch(() => {
      res.status(500).json({ message: 'Ошибка сервера' });
    });
};

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json({ data: users });
    })
    .catch(() => {
      res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .json({ message: DEFAULT_ERROR_MESSAGE });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.status(200).json({ data: user });
    })
    .catch((e) => {
      if (e.message === 'Not found') {
        res.status(STATUS_NOT_FOUND).json({ message: 'User not found' });
      } else {
        res.status(STATUS_BAD_REQUEST).json({ message: DEFAULT_ERROR_MESSAGE });
      }
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

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        res
          .status(STATUS_CONFLICT)
          .json({ message: 'User with this email already exists' });
        return;
      }
      bcrypt.hash(password, 10).then((hash) => {
        User.create({
          email,
          password: hash,
          name,
          about,
          avatar,
        }).then((user) => {
          res.status(200).json({ data: user });
        });
      });
    })
    .catch((e) => {
      const message = Object.values(e.errors)
        .map((err) => err.message)
        .join('; ');
      if (e.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).json({ message });
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
