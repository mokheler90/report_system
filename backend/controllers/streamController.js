const Stream = require('../models/Stream');

const getAllStreams = async (req, res) => {
  try {
    const streams = await Stream.findAll();
    res.json({ success: true, data: streams });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching streams' });
  }
};

const assignPrincipalLecturer = async (req, res) => {
  try {
    const { streamId } = req.params;
    const { principalLecturerId } = req.body;
    
    const stream = await Stream.updatePrincipalLecturer(streamId, principalLecturerId);
    res.json({ success: true, data: stream });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning principal lecturer' });
  }
};

module.exports = {
  getAllStreams,
  assignPrincipalLecturer
};