const STATUS_FORBITTEN = require('../../config');

class ForbittenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = { STATUS_FORBITTEN };
  }
}

module.exports = ForbittenError;
