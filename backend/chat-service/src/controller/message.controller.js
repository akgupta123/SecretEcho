
const { Message } = require('../models/chat.model');
const { AppError } = require('../middleware/errorHandling');
const aiService = require('../services/ai.services');
const getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const user = JSON.parse(req.headers['x-user']);

    const messages = await Message.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const sortedMessages = messages.reverse();

    const total = await Message.countDocuments({ userId: user.userId });

    res.status(200).json({
      status: 'success',
      results: messages.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      data: sortedMessages
    });
  } catch (error) {
    next(error);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const user = JSON.parse(req.headers['x-user']);

    if (!content || content.trim() === '') {
      return next(new AppError('Message content cannot be empty', 400));
    }
    const userMessage = await Message.create({
      sender: 'user',
      userId: user.userId,
      content,
      isRead: true
    });
    const aiResponse = await aiService.generateResponse(content, req.user);
    const aiMessage = await Message.create({
      sender: 'ai',
      userId: user.userId,
      content: aiResponse,
      isRead: false
    });


    const io = req.app.get('io');
    if (io) {
      io.to(user.userId.toString()).emit('message', userMessage);
      
      setTimeout(() => {
        io.to(user.userId.toString()).emit('message', aiMessage);
      }, Math.floor(Math.random() * 1500) + 500);
    }

    res.status(201).json({
      status: 'success',
      data: {
        userMessage,
        aiMessage
      }
    });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const user = JSON.parse(req.headers['x-user']);
    const result = await Message.updateMany(
      { userId: user.userId, isRead: true },
      { isRead: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        modified: result.modifiedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  createMessage,
  markAsRead
};