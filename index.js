require("dotenv").config();
const PORT = 3000;
const express = require("express");
const server = express();
server.use(express.json());

const { apiRouter } = require("./api");
server.use("/api", apiRouter);

const morgan = require("morgan");
server.use(morgan("dev"));

server.use(express.json());

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<____Body Logger END____>");

  next();
});

const { client } = require("./db");
client.connect();

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});
