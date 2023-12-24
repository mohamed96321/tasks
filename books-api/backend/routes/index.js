const bookRoutes = require("./book.routes");

const mountRoutes = (app) => {
  app.use("/api/v1/books", bookRoutes);
};

module.exports = mountRoutes;
