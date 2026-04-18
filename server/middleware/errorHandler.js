function notFoundHandler(request, response) {
  response.status(404).json({
    message: "Route not found."
  });
}

function errorHandler(error, request, response, next) {
  const status = error.statusCode || 500;

  response.status(status).json({
    message:
      status === 404
        ? "GitHub user not found."
        : error.message || "Unexpected server error.",
    status
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};

