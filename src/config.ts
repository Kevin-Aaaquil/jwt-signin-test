require('dotenv').config()

export default {
    MONGODB_URI : process.env.MONGODB_URI,
    DB_NAME: process.env.DB_NAME,
    PORT : process.env.PORT || 3000,
    NODE_ENV : process.env.NODE_ENV
}