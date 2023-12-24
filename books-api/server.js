const app = require("./backend/app");
const env = require("./backend/config/env");
const http = require("http");

// Start the server
const server = http.createServer(app);

server.listen(env.port, () => {
  console.log(`Server started on port: %s.`, env.port);
});

// Close the server
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Server closed.");
    process.exit(1);
  });
});
