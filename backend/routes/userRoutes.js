const express = require('express');
const {
  getUsers,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserById,
  updateUser,
  deactivateUser,
  activateUser,
  deleteUser,
  getUsersStats,
  getUsersByRole,
  assignToStream
} = require('../controllers/userController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Public routes (user's own profile)
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/change-password', changePassword);

// Admin only routes
router.get('/', authorize('program_leader'), getUsers);
router.get('/stats', authorize('program_leader'), getUsersStats);
router.get('/role/:role', authorize('program_leader'), getUsersByRole);
router.get('/:userId', authorize('program_leader'), getUserById);
router.put('/:userId', authorize('program_leader'), updateUser);
router.put('/:userId/assign-stream', authorize('program_leader'), assignToStream);
router.put('/:userId/deactivate', authorize('program_leader'), deactivateUser);
router.put('/:userId/activate', authorize('program_leader'), activateUser);
router.delete('/:userId', authorize('program_leader'), deleteUser);

module.exports = router;