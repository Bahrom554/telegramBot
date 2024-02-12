const express = require('express');
const router = express.Router();
const chat = require('./../schema/chats');
router.get('/hello', async (req, res, next) => {
    try {
        let bot = req.app.get('bot');
        let client = await chat.findOne({});
        res.json(await bot.sendMessage(client.telegram_id, "hello"));
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        next(error);
    }




});

module.exports = router;