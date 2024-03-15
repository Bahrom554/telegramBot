const dotenv = require('dotenv').config();

module.exports = () => {
    return {
        appPort: process.env.PORT,
        appUrl: process.env.URL,
        botToken: process.env.BOT_TOKEN,
        Chat_id: process.env.CHAT_ID
    }


}
