import Suggestion from '../models/Suggestion.js';

// @desc    Get top suggestions by upvotes
// @route   GET /api/stats/top
// @access  Public
export const getTopSuggestions = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const suggestions = await Suggestion.find()
      .populate('author', 'name email')
      .sort({ upvotesCount: -1, createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: suggestions.length,
      suggestions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get status counts
// @route   GET /api/stats/status-counts
// @access  Public
export const getStatusCounts = async (req, res, next) => {
  try {
    const counts = await Suggestion.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      'New': 0,
      'Under Review': 0,
      'Approved': 0,
      'Implemented': 0
    };

    counts.forEach(item => {
      statusCounts[item._id] = item.count;
    });

    res.json({
      success: true,
      statusCounts
    });
  } catch (error) {
    next(error);
  }
};

