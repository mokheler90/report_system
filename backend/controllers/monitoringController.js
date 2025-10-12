const Monitoring = require('../models/Monitoring');

const submitAttendance = async (req, res) => {
  try {
    const monitoringData = {
      ...req.body,
      student_id: req.user.id
    };

    const monitoring = await Monitoring.create(monitoringData);
    res.status(201).json({ success: true, data: monitoring });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting attendance' });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Monitoring.findByStudent(req.user.id);
    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance' });
  }
};

const getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const attendance = await Monitoring.findByClass(classId);
    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class attendance' });
  }
};

module.exports = {
  submitAttendance,
  getMyAttendance,
  getClassAttendance
};