const express = require("express");
const path = require("path");

const PORT = process.env.port || 4001;

const app = express();
app.use(express.static(path.join(__dirname + "/front")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(PORT);
