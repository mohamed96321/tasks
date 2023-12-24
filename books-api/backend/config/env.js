// keys.js - figure out what set of credentails to return
if (process.env.NODE_ENV === "production") {
  // we are in production - return the prod set of keys
  module.exports = require("./env.prod");
} else {
  // we are in development - return the dev keys!!
  module.exports = require("./env.dev");
}
