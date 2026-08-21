const express = require("express");
const {
  createBookingController,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", createBookingController);

module.exports = router;
