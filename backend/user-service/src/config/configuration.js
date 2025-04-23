require('dotenv').config({ path: './src/.env' });

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    JWT_SECRET
}