const User = require('../models/users');

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(500).send({ message: 'smth went wrong' });
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
      console.log('e => ', e);
      if (e.message === 'Not found') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(500).send({ message: 'Smth went wrong' });
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
      console.log('e => ', e);
      const message = Object.values(e.errors)
        .map((err) => err.message)
        .join('; ');
      if (e.name == 'ValidationError') {
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Smth went wrong' });
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
      console.log('e => ', e);
      const message = Object.values(e.errors)
        .map((err) => err.message)
        .join('; ');
      if (e.message === 'Not found') {
        res.status(404).send({ message: 'User not found' });
      } else if (e.name == 'ValidationError') {
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Smth went wrong' });
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
      console.log('e => ', e);
      const message = Object.values(e.errors)
        .map((err) => err.message)
        .join('; ');
      if (e.message === 'Not found') {
        res.status(404).send({ message: 'User not found' });
      } else if (e.name == 'ValidationError') {
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Smth went wrong' });
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
