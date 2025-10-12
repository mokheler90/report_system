const { pool } = require('../config/database');

class Monitoring {
  static async create(monitoringData) {
    const { student_id, class_id, report_id, attendance_status, student_notes } = monitoringData;
    const result = await pool.query(
      `INSERT INTO monitoring (student_id, class_id, report_id, attendance_status, student_notes) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [student_id, class_id, report_id, attendance_status, student_notes]
    );
    return result.rows[0];
  }

  static async findByStudent(studentId) {
    const result = await pool.query(`
      SELECT m.*, r.course_name, r.date_of_lecture, c.class_name 
      FROM monitoring m 
      LEFT JOIN reports r ON m.report_id = r.id 
      LEFT JOIN classes c ON m.class_id = c.id 
      WHERE m.student_id = $1 
      ORDER BY m.monitored_at DESC
    `, [studentId]);
    return result.rows;
  }

  static async findByClass(classId) {
    const result = await pool.query(`
      SELECT m.*, u.full_name as student_name, u.email as student_email 
      FROM monitoring m 
      LEFT JOIN users u ON m.student_id = u.id 
      WHERE m.class_id = $1 
      ORDER BY u.full_name
    `, [classId]);
    return result.rows;
  }
}

module.exports = Monitoring;