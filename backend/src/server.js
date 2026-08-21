require("dotenv").config();

const express = require("express");
const cors = require("cors");

const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Medical Quote API is running.",
  });
});

app.use("/api/booking", bookingRoutes);

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  console.log(
    `Medical Quote API running on http://localhost:${port}`
  );
});
