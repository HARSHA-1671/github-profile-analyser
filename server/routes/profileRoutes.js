const express = require("express");
const {
  getProfileReport,
  compareProfiles,
  getHealth
} = require("../controllers/profileController");

const router = express.Router();

router.get("/profile/:username", getProfileReport);
router.get("/compare", compareProfiles);
router.get("/health", getHealth);

module.exports = router;
