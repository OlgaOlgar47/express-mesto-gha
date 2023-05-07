/* eslint-disable consistent-return */
const Card = require('../models/cards');
const {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  DEFAULT_ERROR_MESSAGE,
} = require('../config');
const NotFoundError = require('../utils/errors/NotFoundError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const getCards = (req, res, next) => {
  Card.find({}, { __v: 0 })
    .then((cards) => {
      res.json({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      card.populate('owner');
      res.status(201).json({ data: card });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findOneAndRemove({ _id: cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError();
      }
      if (card.owner.toString() !== req.user._id) {
        throw new UnauthorizedError();
      }
      res.json({ deletedData: card });
    })
    .catch(next);
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.json({ data: card });
    })
    .catch((e) => {
      if (e.message === 'Not found') {
        res.status(STATUS_NOT_FOUND).json({ message: 'Card not found' });
      } else {
        res.status(STATUS_BAD_REQUEST).json({ message: DEFAULT_ERROR_MESSAGE });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.json({ data: card });
    })
    .catch((e) => {
      if (e.message === 'Not found') {
        res.status(STATUS_NOT_FOUND).json({ message: 'Card not found' });
      } else {
        res.status(STATUS_BAD_REQUEST).json({ message: DEFAULT_ERROR_MESSAGE });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
