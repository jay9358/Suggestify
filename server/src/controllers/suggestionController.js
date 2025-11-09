import Suggestion from '../models/Suggestion.js';

// @desc    Create suggestion
// @route   POST /api/suggestions
// @access  Private
export const createSuggestion = async (req, res, next) => {
  try {
    req.body.author = req.user._id;
    const suggestion = await Suggestion.create(req.body);

    await suggestion.populate('author', 'name email');

    res.status(201).json({
      success: true,
      suggestion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all suggestions
// @route   GET /api/suggestions
// @access  Public
export const getSuggestions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by tag
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }

    // Search in title and description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Build sort
    let sort = {};
    if (req.query.sort === 'top') {
      sort = { upvotesCount: -1, createdAt: -1 };
    } else {
      sort = { createdAt: -1 };
    }

    const suggestions = await Suggestion.find(query)
      .populate('author', 'name email')
      .populate('upvoters', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Suggestion.countDocuments(query);

    res.json({
      success: true,
      count: suggestions.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      suggestions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single suggestion
// @route   GET /api/suggestions/:id
// @access  Public
export const getSuggestion = async (req, res, next) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id)
      .populate('author', 'name email')
      .populate('upvoters', 'name email');

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      });
    }

    res.json({
      success: true,
      suggestion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update suggestion
// @route   PATCH /api/suggestions/:id
// @access  Private
export const updateSuggestion = async (req, res, next) => {
  try {
    let suggestion = await Suggestion.findById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      });
    }

    // Check if user is owner or admin
    if (suggestion.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this suggestion'
      });
    }

    // Remove fields that shouldn't be updated directly
    const { status, upvotesCount, upvoters, author, ...updateData } = req.body;

    suggestion = await Suggestion.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    res.json({
      success: true,
      suggestion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete suggestion
// @route   DELETE /api/suggestions/:id
// @access  Private
export const deleteSuggestion = async (req, res, next) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      });
    }

    // Check if user is owner or admin
    if (suggestion.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this suggestion'
      });
    }

    await suggestion.deleteOne();

    res.json({
      success: true,
      message: 'Suggestion deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update suggestion status
// @route   PATCH /api/suggestions/:id/status
// @access  Private/Manager+
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const suggestion = await Suggestion.findById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      });
    }

    suggestion.status = status;
    await suggestion.save();

    await suggestion.populate('author', 'name email');

    res.json({
      success: true,
      suggestion
    });
  } catch (error) {
    next(error);
  }
};

