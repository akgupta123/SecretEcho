const express = require("express");
const cors = require("cors")
const { connectDB } = require("./config/db")
const chatRoutes = require("./routes/chat.route");
const helmet = require("helmet");
const http = require('http');
require('dotenv').config({ path: './src/.env' });
require("./config/configuration");
const setupSocketIO = require("../src/services/socket.service")
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000
app.use(helmet());
app.use(cors());
app.use(express.json());
connectDB();
const io = setupSocketIO(server);
app.set('io', io);

app.get('/api/test', (req, res) => {
    res.send('Server is working!');
  });  

app.use("/message", chatRoutes);
app.use((err , req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
    });
    next();
})

server.listen(PORT, () => {
    console.log(`Server listening at ${PORT} `)

})

module.exports = app;