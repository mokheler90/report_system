const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('❌ Error:', err);

  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // unique_violation
        error.message = 'Duplicate field value entered';
        error.statusCode = 400;
        break;
      case '23503': // foreign_key_violation
        error.message = 'Resource not found';
        error.statusCode = 404;
        break;
      case '23502': // not_null_violation
        error.message = 'Required field is missing';
        error.statusCode = 400;
        break;
      case '22P02': // invalid_text_representation
        error.message = 'Invalid data format';
        error.statusCode = 400;
        break;
      case '42601': // syntax_error
        error.message = 'Database syntax error';
        error.statusCode = 500;
        break;
      default:
        error.message = 'Database error';
        error.statusCode = 500;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = messages.join(', ');
    error.statusCode = 400;
  }

  // Cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = 404;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;