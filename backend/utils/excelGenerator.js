const ExcelJS = require('exceljs');

const generateReportsExcel = (reports) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reports');

  // Add headers
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Faculty', key: 'faculty_name', width: 20 },
    { header: 'Class', key: 'class_name', width: 15 },
    { header: 'Week', key: 'week_of_reporting', width: 15 },
    { header: 'Date', key: 'date_of_lecture', width: 15 },
    { header: 'Course', key: 'course_name', width: 20 },
    { header: 'Lecturer', key: 'lecturer_name', width: 20 },
    { header: 'Students Present', key: 'actual_students_present', width: 15 },
    { header: 'Total Students', key: 'total_registered_students', width: 15 },
    { header: 'Venue', key: 'venue', width: 15 },
    { header: 'Status', key: 'report_status', width: 15 }
  ];

  // Add data
  reports.forEach(report => {
    worksheet.addRow(report);
  });

  // Style headers
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6E6FA' }
  };

  return workbook;
};

module.exports = { generateReportsExcel };