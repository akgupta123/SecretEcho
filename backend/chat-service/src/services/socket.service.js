const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { Message } = require('../models/chat.model');
const axios = require("axios");
const { USER_SERVICE_URL, JWT_SECRET } = require('../config/configuration');
const socketHandler = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : ['http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.headers.authorization?.split(" ")[1];      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const { data: user } = await axios.get(`${USER_SERVICE_URL}/user/${decoded.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });  
      if (!user) {
        return next(new Error('User not found'));
      }
      socket.user = {
        _id: user.data?._id,
        email: user.data?.email
      };
      
      next();
    } catch (error) {
      console.log(`Socket authentication error: ${error.message}`);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    const username = socket.user.username;
    
    console.log(`User connected: ${username} (${userId})`);
    socket.join(userId);
    Message.findByIdAndUpdate(userId, { 
      isActive: true,
      lastSeen: Date.now()
    }).catch(err => {
      console.log(`Error updating user status: ${err.message}`);
    });
    socket.on('typing', (isTyping) => {s
      console.log(`User ${username} typing status: ${isTyping}`);
    });
    
    socket.on('disconnect', () => {
    //  console.log(`User disconnected: ${user?.username} (${userId})`);
      Message.findByIdAndUpdate(userId, {
        isActive: false,
        lastSeen: Date.now() 
      }).catch(err => {
        console.log(`Error updating user status `);
      });
    });
  });

  return io;
};

module.exports = socketHandler;