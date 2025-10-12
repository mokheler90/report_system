const { pool } = require('../config/database');

class Feedback {
  static async create(feedbackData) {
    const { principal_lecturer_id, report_id, feedback_text } = feedbackData;
    const result = await pool.query(
      `INSERT INTO feedback (principal_lecturer_id, report_id, feedback_text) 
       VALUES ($1, $2, $3) RETURNING *`,
      [principal_lecturer_id, report_id, feedback_text]
    );
    return result.rows[0];
  }

  static async findByReport(reportId) {
    const result = await pool.query(`
      SELECT f.*, u.full_name as principal_lecturer_name 
      FROM feedback f 
      LEFT JOIN users u ON f.principal_lecturer_id = u.id 
      WHERE f.report_id = $1 
      ORDER BY f.created_at DESC
    `, [reportId]);
    return result.rows;
  }

  static async findByPrincipalLecturer(principalLecturerId) {
    const result = await pool.query(`
      SELECT f.*, r.course_name, r.lecturer_name 
      FROM feedback f 
      LEFT JOIN reports r ON f.report_id = r.id 
      WHERE f.principal_lecturer_id = $1 
      ORDER BY f.created_at DESC
    `, [principalLecturerId]);
    return result.rows;
  }
}

module.exports = Feedback;