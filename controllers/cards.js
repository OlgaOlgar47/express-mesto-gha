const Card = require('../models/cards');

const getCards = (req, res) => {
  Card.find({}, { __v: 0 })
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res.status(500).send({ message: 'smth went wrong' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      card.populate('owner');
      res.status(201).send({ data: card });
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

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => res.send({ deletedData: card }))
    .catch((e) => {
      console.log('e => ', e);
      if (e.message === 'Not found') {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(500).send({ message: 'Smth went wrong' });
      }
    });
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
      res.send({ data: card });
    })
    .catch((e) => {
      if (e.message === 'Not found') {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(500).send({ message: 'Smth went wrong' });
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
      res.send({ data: card });
    })
    .catch((e) => {
      if (e.message === 'Not found') {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(500).send({ message: 'Smth went wrong' });
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
