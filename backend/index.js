const express = require("express");
const app = express();
const port = 5000;

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.post("/action", (req, res) => {
  console.log(req.body);
  res.status(200).send("OK");
});

app.listen(port, () => {
  console.log(`User action logging app started on port ${port}`);
});
