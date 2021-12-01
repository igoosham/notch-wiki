const express = require("express");

const router = require("./routes");

const app = express();
const port = 3000;

app.use(express.json());

app.use(router);

// handling wrong addresses
app.use(function (req, res, next) {
  const message = req.url + " does not exist";
  res.status(404).send(message);
  return;
});

// error handling
app.use(function (error, req, res, next) {
  res.status(500).send(error.message);
  return;
});

app.listen(port, function () {
  console.log("Server is running on port", port);
});
