require('dotenv').config();


module.exports = () => {
    return {
        dbName: process.env.DATABASE_NAME,
        dbHost: process.env.DATABASE_HOST,
        dbPort: process.env.DATABASE_PORT,
        dbUserName: process.env.DATABASE_USER_NAME, /* Required If You Want To Build Your Own DB URL */
        dbPassword: process.env.DATABASE_PASSWORD, /* Required If You Want To Build Your Own DB URL */
        rHost: process.env.REDIS_HOST,
        rPort: process.env.REDIS_PORT,
    }
}