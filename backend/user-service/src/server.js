const express = require("express");
const cors = require("cors")
const { connectDB } = require("./config/db")
const userRoutes = require("../src/routes/user.route");
const helmet = require("helmet");
require('dotenv').config({ path: './src/.env' });
require("./config/configuration");
const app = express();
const PORT = process.env.PORT || 4001
app.use(helmet());
app.use(cors());
app.use(express.json());
connectDB();

app.get('/api/test', (req, res) => {
    res.send('Server is working!');
  });  

app.use("/user", userRoutes);
app.use((err , req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
    });
})
app.listen(PORT, () => {
    console.log(`Server listening at ${PORT} `)

})