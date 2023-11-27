// This class responsible about operation error that i expected to occurr.
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = ApiError;
