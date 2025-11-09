import Suggestion from '../models/Suggestion.js';

// @desc    Toggle upvote on suggestion
// @route   POST /api/suggestions/:id/upvote
// @access  Private
export const toggleUpvote = async (req, res, next) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      });
    }

    const userId = req.user._id;
    const isUpvoted = suggestion.upvoters.some(
      upvoter => upvoter.toString() === userId.toString()
    );

    let upvoted;
    if (isUpvoted) {
      // Remove upvote
      await Suggestion.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { upvoters: userId },
          $inc: { upvotesCount: -1 }
        },
        { new: true }
      );
      upvoted = false;
    } else {
      // Add upvote
      await Suggestion.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { upvoters: userId },
          $inc: { upvotesCount: 1 }
        },
        { new: true }
      );
      upvoted = true;
    }

    // Get updated count
    const updated = await Suggestion.findById(req.params.id);

    res.json({
      success: true,
      upvotesCount: updated.upvotesCount,
      upvoted
    });
  } catch (error) {
    next(error);
  }
};

