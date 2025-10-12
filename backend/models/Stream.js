const { pool } = require('../config/database');

class Stream {
  static async findAll() {
    const result = await pool.query(`
      SELECT s.*, u.full_name as principal_lecturer_name 
      FROM streams s 
      LEFT JOIN users u ON s.principal_lecturer_id = u.id 
      ORDER BY s.stream_name
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(`
      SELECT s.*, u.full_name as principal_lecturer_name 
      FROM streams s 
      LEFT JOIN users u ON s.principal_lecturer_id = u.id 
      WHERE s.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async updatePrincipalLecturer(streamId, principalLecturerId) {
    const result = await pool.query(
      'UPDATE streams SET principal_lecturer_id = $1 WHERE id = $2 RETURNING *',
      [principalLecturerId, streamId]
    );
    return result.rows[0];
  }
}

module.exports = Stream;