const { MovieNotFoundError, DatabaseWriteError } = require('./error');

const errorHandlingMiddleware = (err, req, res, next) => {
  if (err instanceof MovieNotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  if (err instanceof DatabaseWriteError) {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandlingMiddleware;
