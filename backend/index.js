const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
const router = express.Router();

app.use("/", router);
app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.post("/action", (req, res) => {
  res.status(200).send("okey");
  console.log(req.body);
});

app.listen(port, () => {
  console.log(`User action logging app started on port ${port}`);
});
