const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const { Auth } = require("./middleware/authMiddleware");
const authRouter = require("./routes/Auth");
const connectMongoDB = require("./config/mongo");
connectMongoDB();

app.get("/", Auth("user"), (req, res) => {
  res.status(200).send("RestFi v2 is running");
});

//Auth Route
app.use("/auth", authRouter);

//User dashboard
app.get("/user/dashboard", Auth("user"), (req, res) => {
  res.status(200).json({ message: "welcome restfi user" });
});

// Global 404 error handler
app.use((req, res, next) => {
  res.status(404).send("404 - Not Found");
});

app.listen(port, () => {
  console.log(`backend is running on port ${port}`);
});
