const { pool } = require('../config/database');

class Report {
  static async create(reportData) {
    const {
      faculty_name, class_name, week_of_reporting, date_of_lecture,
      course_name, course_code, lecturer_name, actual_students_present,
      total_registered_students, venue, scheduled_time, topic_taught,
      learning_outcomes, lecturer_recommendations, lecturer_id, course_id,
      class_id, stream_id
    } = reportData;

    const result = await pool.query(
      `INSERT INTO reports (
        faculty_name, class_name, week_of_reporting, date_of_lecture,
        course_name, course_code, lecturer_name, actual_students_present,
        total_registered_students, venue, scheduled_time, topic_taught,
        learning_outcomes, lecturer_recommendations, lecturer_id, course_id,
        class_id, stream_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`,
      [
        faculty_name, class_name, week_of_reporting, date_of_lecture,
        course_name, course_code, lecturer_name, actual_students_present,
        total_registered_students, venue, scheduled_time, topic_taught,
        learning_outcomes, lecturer_recommendations, lecturer_id, course_id,
        class_id, stream_id
      ]
    );
    return result.rows[0];
  }

  static async findByLecturer(lecturerId) {
    const result = await pool.query(
      'SELECT * FROM reports WHERE lecturer_id = $1 ORDER BY created_at DESC',
      [lecturerId]
    );
    return result.rows;
  }

  static async findByStream(streamId) {
    const result = await pool.query(
      'SELECT * FROM reports WHERE stream_id = $1 ORDER BY created_at DESC',
      [streamId]
    );
    return result.rows;
  }

  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM reports ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async updateStatus(reportId, status, userId = null) {
    let query = 'UPDATE reports SET report_status = $1';
    const values = [status, reportId];
    let paramCount = 2;

    if (status === 'submitted_to_prl') {
      query += `, submitted_to_prl_at = NOW(), submitted_to_prl_by = $${paramCount + 1}`;
      values.push(userId);
    } else if (status === 'approved') {
      query += `, approved_at = NOW(), approved_by = $${paramCount + 1}`;
      values.push(userId);
    }

    query += ' WHERE id = $2 RETURNING *';

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async searchReports(searchTerm, filters = {}) {
    let query = `
      SELECT * FROM reports 
      WHERE (course_name ILIKE $1 OR lecturer_name ILIKE $1 OR class_name ILIKE $1)
    `;
    const values = [`%${searchTerm}%`];
    let paramCount = 1;

    if (filters.stream_id) {
      paramCount++;
      query += ` AND stream_id = $${paramCount}`;
      values.push(filters.stream_id);
    }

    if (filters.report_status) {
      paramCount++;
      query += ` AND report_status = $${paramCount}`;
      values.push(filters.report_status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }
}

module.exports = Report;