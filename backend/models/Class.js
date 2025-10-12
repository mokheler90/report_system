const { pool } = require('../config/database');

class Class {
  static async findByLecturer(lecturerId) {
    const result = await pool.query(`
      SELECT c.*, co.course_name, s.stream_name 
      FROM classes c 
      LEFT JOIN courses co ON c.course_id = co.id 
      LEFT JOIN streams s ON c.stream_id = s.id 
      WHERE c.lecturer_id = $1 
      ORDER BY c.class_name
    `, [lecturerId]);
    return result.rows;
  }

  static async findAll() {
    const result = await pool.query(`
      SELECT c.*, co.course_name, s.stream_name, u.full_name as lecturer_name 
      FROM classes c 
      LEFT JOIN courses co ON c.course_id = co.id 
      LEFT JOIN streams s ON c.stream_id = s.id 
      LEFT JOIN users u ON c.lecturer_id = u.id 
      ORDER BY c.class_name
    `);
    return result.rows;
  }
}

module.exports = Class;