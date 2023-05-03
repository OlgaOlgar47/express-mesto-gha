const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getUserMe,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/users/me', getUserMe);
userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUser);
userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);
userRouter.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().min(2).max(30),
    }),
  }),
  updateAvatar
);

module.exports = userRouter;
