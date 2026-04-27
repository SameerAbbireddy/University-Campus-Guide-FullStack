const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const placeRoutes = require("./routes/placeRoutes");

const app = express();

// middleware
app.use(express.json({ limit: "1mb" }));
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// health route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);

// db connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => console.error("DB connection error:", err));