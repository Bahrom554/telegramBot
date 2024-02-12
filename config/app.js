const dotenv = require('dotenv').config();

module.exports = () => {
    return {
        appPort: process.env.PORT
    }


}
