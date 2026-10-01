const express = require("express");
const router = express.Router();
const { sendMessage, getMessages } = require("../controllers/message.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

router.post("/send", authenticateToken, sendMessage);
router.get("/:id", authenticateToken, getMessages);

module.exports = router;
