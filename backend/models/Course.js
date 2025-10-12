const { pool } = require('../config/database');

class Course {
  static async findAll() {
    const result = await pool.query(`
      SELECT c.*, s.stream_name 
      FROM courses c 
      LEFT JOIN streams s ON c.stream_id = s.id 
      ORDER BY c.course_name
    `);
    return result.rows;
  }

  static async findByStream(streamId) {
    const result = await pool.query(
      'SELECT * FROM courses WHERE stream_id = $1 ORDER BY course_name',
      [streamId]
    );
    return result.rows;
  }

  static async create(courseData) {
    const { course_code, course_name, description, stream_id, credits, semester, program_leader_id } = courseData;
    const result = await pool.query(
      `INSERT INTO courses (course_code, course_name, description, stream_id, credits, semester, program_leader_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [course_code, course_name, description, stream_id, credits, semester, program_leader_id]
    );
    return result.rows[0];
  }
}

module.exports = Course;