const Rating = require('../models/Rating');

const submitRating = async (req, res) => {
  try {
    const ratingData = {
      ...req.body,
      rater_id: req.user.id
    };

    // Check if user already rated this entity
    const existingRating = await Rating.findByUserAndEntity(
      req.user.id,
      ratingData.rated_entity_type,
      ratingData.rated_entity_id
    );

    if (existingRating) {
      return res.status(400).json({ 
        message: 'You have already rated this entity. Please update your existing rating instead.' 
      });
    }

    const rating = await Rating.create(ratingData);
    res.status(201).json({ 
      success: true, 
      message: 'Rating submitted successfully',
      data: rating 
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ message: 'Error submitting rating' });
  }
};

const getRatings = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    
    // Validate entity type
    const validEntityTypes = ['lecturer', 'course', 'class', 'stream'];
    if (!validEntityTypes.includes(entityType)) {
      return res.status(400).json({ message: 'Invalid entity type' });
    }

    const ratings = await Rating.findByEntity(entityType, entityId);
    const averageRating = await Rating.getAverageRating(entityType, entityId);
    const ratingCount = ratings.length;
    
    res.json({ 
      success: true, 
      data: { 
        ratings, 
        average_rating: averageRating,
        rating_count: ratingCount
      } 
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Error fetching ratings' });
  }
};

const getMyRatings = async (req, res) => {
  try {
    const ratings = await Rating.findByUser(req.user.id);
    res.json({ 
      success: true, 
      data: ratings 
    });
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    res.status(500).json({ message: 'Error fetching your ratings' });
  }
};

const updateRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { rating_value, review_text } = req.body;

    // Check if rating exists and belongs to user
    const existingRating = await Rating.findById(ratingId);
    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    if (existingRating.rater_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own ratings' });
    }

    const updatedRating = await Rating.update(ratingId, {
      rating_value,
      review_text,
      updated_at: new Date()
    });

    res.json({ 
      success: true, 
      message: 'Rating updated successfully',
      data: updatedRating 
    });
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ message: 'Error updating rating' });
  }
};

const deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;

    // Check if rating exists and belongs to user
    const existingRating = await Rating.findById(ratingId);
    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    if (existingRating.rater_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own ratings' });
    }

    await Rating.delete(ratingId);

    res.json({ 
      success: true, 
      message: 'Rating deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ message: 'Error deleting rating' });
  }
};

module.exports = {
  submitRating,
  getRatings,
  getMyRatings,
  updateRating,
  deleteRating
};