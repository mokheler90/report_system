const Class = require('../models/Class');

const getMyClasses = async (req, res) => {
  try {
    const classes = await Class.findByLecturer(req.user.id);
    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes' });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll();
    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes' });
  }
};

module.exports = {
  getMyClasses,
  getAllClasses
};