const Feedback = require('../models/Feedback');

const addFeedback = async (req, res) => {
  try {
    const feedbackData = {
      ...req.body,
      principal_lecturer_id: req.user.id
    };

    const feedback = await Feedback.create(feedbackData);
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ message: 'Error adding feedback' });
  }
};

const getReportFeedback = async (req, res) => {
  try {
    const { reportId } = req.params;
    const feedback = await Feedback.findByReport(reportId);
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback' });
  }
};

const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByPrincipalLecturer(req.user.id);
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback' });
  }
};

module.exports = {
  addFeedback,
  getReportFeedback,
  getMyFeedback
};