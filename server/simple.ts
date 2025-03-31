import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(3001, "0.0.0.0", () => {
  console.log("Simple server running on port 3001");
});