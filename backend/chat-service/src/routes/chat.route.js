
const express = require('express');
const router = express.Router();
const { getMessages, createMessage, markAsRead } = require('../controller/message.controller');

router.get('/', getMessages);
router.post('/', createMessage);

router.put('/read', markAsRead);

module.exports = router;