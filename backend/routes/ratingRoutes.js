const express = require('express');
const { submitRating, getRatings, getMyRatings, updateRating, deleteRating } = require('../controllers/ratingController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Submit a rating
router.post('/', submitRating);

// Get ratings for a specific entity (course, lecturer, class, stream)
router.get('/:entityType/:entityId', getRatings);

// Get my ratings
router.get('/my-ratings', getMyRatings);

// Update a rating
router.put('/:ratingId', updateRating);

// Delete a rating
router.delete('/:ratingId', deleteRating);

module.exports = router;