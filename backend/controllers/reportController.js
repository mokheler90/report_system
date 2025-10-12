const Report = require('../models/Report');
const { pool } = require('../config/database');

const createReport = async (req, res) => {
  try {
    const reportData = {
      ...req.body,
      lecturer_id: req.user.id,
      lecturer_name: req.user.full_name
    };

    const report = await Report.create(reportData);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ message: 'Error creating report' });
  }
};

const getMyReports = async (req, res) => {
  try {
    const reports = await Report.findByLecturer(req.user.id);
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports' });
  }
};

const getStreamReports = async (req, res) => {
  try {
    let reports;
    if (req.user.role === 'principal_lecturer' && req.user.managed_stream_id) {
      reports = await Report.findByStream(req.user.managed_stream_id);
    } else {
      reports = await Report.findAll();
    }
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports' });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports' });
  }
};

const submitToPRL = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.updateStatus(reportId, 'submitted_to_prl', req.user.id);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting report' });
  }
};

const approveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.updateStatus(reportId, 'approved', req.user.id);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ message: 'Error approving report' });
  }
};

const searchReports = async (req, res) => {
  try {
    const { searchTerm, stream_id, report_status } = req.query;
    const reports = await Report.searchReports(searchTerm, { stream_id, report_status });
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ message: 'Error searching reports' });
  }
};

module.exports = {
  createReport,
  getMyReports,
  getStreamReports,
  getAllReports,
  submitToPRL,
  approveReport,
  searchReports
};