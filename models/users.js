const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { default: isEmail } = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Некорректно введен email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: {
        validator(v) {
          return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?#?$/.test(v);
        },
        message: 'Некорректно введена ссылка на аватар',
      },
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
  { toJSON: { useProjection: true }, toObject: { useProjection: true } }
);

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  const isEmailValid = isEmail(email);
  if (!isEmailValid) {
    return Promise.reject(new Error('Неправильные почта или пароль'));
  }
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        return user; // теперь user доступен
      });
    });
};

module.exports = mongoose.model('User', userSchema);
