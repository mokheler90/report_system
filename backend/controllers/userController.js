const bcrypt = require('bcryptjs');
const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const { role, stream_id, is_active, search } = req.query;
    const filters = {};

    if (role) filters.role = role;
    if (stream_id) filters.stream_id = stream_id;
    if (is_active !== undefined) filters.is_active = is_active === 'true';

    let users;
    if (search) {
      users = await User.searchUsers(search, filters);
    } else {
      users = await User.findAll();
    }

    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.getUserWithStream(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { full_name, email, username } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const emailTaken = await User.isEmailTaken(email, req.user.id);
      if (emailTaken) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }

    // Check if username is already taken by another user
    if (username) {
      const usernameTaken = await User.isUsernameTaken(username, req.user.id);
      if (usernameTaken) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }

    const updates = {};
    if (full_name) updates.full_name = full_name;
    if (email) updates.email = email;
    if (username) updates.username = username;

    const updatedUser = await User.update(req.user.id, updates);
    res.json({ 
      success: true, 
      message: 'Profile updated successfully', 
      data: updatedUser 
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await User.updatePassword(req.user.id, hashedPassword);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.getUserWithStream(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { full_name, email, username, role, stream_id, managed_stream_id, is_active } = req.body;

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== existingUser.email) {
      const emailTaken = await User.isEmailTaken(email, userId);
      if (emailTaken) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }

    // Check if username is already taken by another user
    if (username && username !== existingUser.username) {
      const usernameTaken = await User.isUsernameTaken(username, userId);
      if (usernameTaken) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }

    const updates = {};
    if (full_name) updates.full_name = full_name;
    if (email) updates.email = email;
    if (username) updates.username = username;
    if (role) updates.role = role;
    if (stream_id !== undefined) updates.stream_id = stream_id;
    if (managed_stream_id !== undefined) updates.managed_stream_id = managed_stream_id;
    if (is_active !== undefined) updates.is_active = is_active;

    const updatedUser = await User.update(userId, updates);
    res.json({ 
      success: true, 
      message: 'User updated successfully', 
      data: updatedUser 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.deactivate(userId);
    res.json({ success: true, message: 'User deactivated successfully', data: user });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({ message: 'Error deactivating user' });
  }
};

const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.activate(userId);
    res.json({ success: true, message: 'User activated successfully', data: user });
  } catch (error) {
    console.error('Error activating user:', error);
    res.status(500).json({ message: 'Error activating user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prevent users from deleting themselves
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const deletedUser = await User.delete(userId);
    res.json({ success: true, message: 'User deleted successfully', data: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

const getUsersStats = async (req, res) => {
  try {
    const stats = await User.getUsersStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
};

const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.findByRole(role);
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ message: 'Error fetching users by role' });
  }
};

const assignToStream = async (req, res) => {
  try {
    const { userId } = req.params;
    const { stream_id } = req.body;

    const user = await User.assignToStream(userId, stream_id);
    res.json({ success: true, message: 'User assigned to stream successfully', data: user });
  } catch (error) {
    console.error('Error assigning user to stream:', error);
    res.status(500).json({ message: 'Error assigning user to stream' });
  }
};

module.exports = {
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
};