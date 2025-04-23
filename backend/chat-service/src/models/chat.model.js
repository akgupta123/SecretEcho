const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['user', 'ai']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  lastSeen : {
  type : Date,
  },
  isActive : {
    type : Boolean,
    default : false
  }
}, {
  timestamps: true
});
messageSchema.index({ userId: 1, createdAt: -1 });

module.exports.Message = mongoose.model('Message', messageSchema);
