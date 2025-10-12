const Course = require('../models/Course');

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

const getStreamCourses = async (req, res) => {
  try {
    const { streamId } = req.params;
    const courses = await Course.findByStream(streamId);
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

const createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      program_leader_id: req.user.id
    };
    const course = await Course.create(courseData);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course' });
  }
};

module.exports = {
  getAllCourses,
  getStreamCourses,
  createCourse
};