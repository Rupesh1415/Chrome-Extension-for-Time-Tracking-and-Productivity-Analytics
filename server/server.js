const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let records = [];

app.post("/save", (req, res) => {
  records.push(req.body);
  res.send({ message: "Data saved" });
});

app.get("/report", (req, res) => {
  res.json(records);
});

app.get("/", (req, res) => {
  res.send("Chrome Extension Backend is Running 🚀");
});

app.listen(5000, () => console.log("Server running on port 5000"));