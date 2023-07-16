// Custom error classes
class MovieNotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'MovieNotFoundError';
    }
  }

class DatabaseWriteError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseWriteError';
    }
}


class ClientError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ClientError';
    }
}
module.exports = {
    MovieNotFoundError,
    DatabaseWriteError,
    ClientError
  };