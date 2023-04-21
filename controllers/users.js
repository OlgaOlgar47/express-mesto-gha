const User = require('../models/users');
const {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
} = require('../config');

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((e) => {
      if (e.message === 'Not found') {
        res.status(STATUS_NOT_FOUND).send({ message: 'User not found' });
      } else {
        res.status(STATUS_BAD_REQUEST).send({ DEFAULT_ERROR_MESSAGE });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((e) => {
      const message = Object.values(e.errors)
        .map((err) => err.message)
        .join('; ');
      if (e.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ DEFAULT_ERROR_MESSAGE });
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
      res.send({ data: user });
    })
    .catch((e) => {
      const message = Object.values(e.errors)
        .map((err) => err.message)
        .join('; ');
      if (e.message === 'Not found') {
        res.status(STATUS_NOT_FOUND).send({ message: 'User not found' });
      } else if (e.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: DEFAULT_ERROR_MESSAGE });
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
      res.send({ data: user });
    })
    .catch((e) => {
      const message = Object.values(e.errors)
        .map((err) => err.message)
        .join('; ');
      if (e.message === 'Not found') {
        res.status(STATUS_NOT_FOUND).send({ message: 'User not found' });
      } else if (e.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ DEFAULT_ERROR_MESSAGE });
      }
    });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
};
