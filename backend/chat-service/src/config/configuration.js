require('dotenv').config({ path: './src/.env' });

const JWT_SECRET = process.env.JWT_SECRET;
const USER_SERVICE_URL =  process.env.USER_SERVICE_URL

module.exports = {
    JWT_SECRET,USER_SERVICE_URL
}