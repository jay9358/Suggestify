import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [150, 'Title cannot exceed 150 characters'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['New', 'Under Review', 'Approved', 'Implemented'],
    default: 'New'
  },
  upvotesCount: {
    type: Number,
    default: 0
  },
  upvoters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  attachments: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
suggestionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for performance
suggestionSchema.index({ createdAt: -1 });
suggestionSchema.index({ status: 1 });
suggestionSchema.index({ upvotesCount: -1 });
suggestionSchema.index({ tags: 1 });

export default mongoose.model('Suggestion', suggestionSchema);

