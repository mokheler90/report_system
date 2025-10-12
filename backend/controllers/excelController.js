const Report = require('../models/Report');
const { generateReportsExcel } = require('../utils/excelGenerator');

const exportReportsToExcel = async (req, res) => {
  try {
    let reports;
    
    if (req.user.role === 'lecturer') {
      reports = await Report.findByLecturer(req.user.id);
    } else if (req.user.role === 'principal_lecturer' && req.user.managed_stream_id) {
      reports = await Report.findByStream(req.user.managed_stream_id);
    } else {
      reports = await Report.findAll();
    }

    const workbook = generateReportsExcel(reports);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reports.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Error generating Excel report' });
  }
};

module.exports = {
  exportReportsToExcel
};