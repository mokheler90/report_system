const { pool } = require('../config/database');

class User {
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, username, email, role, full_name, stream_id, managed_stream_id, is_active, last_login, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(userData) {
    const { username, email, password, role, full_name, stream_id, managed_stream_id } = userData;
    const result = await pool.query(
      `INSERT INTO users (username, email, password, role, full_name, stream_id, managed_stream_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, username, email, role, full_name, stream_id, managed_stream_id, created_at`,
      [username, email, password, role, full_name, stream_id, managed_stream_id]
    );
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      fields.push(`${key} = $${paramCount}`);
      values.push(updates[key]);
      paramCount++;
    });

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} 
                   RETURNING id, username, email, role, full_name, stream_id, managed_stream_id, is_active, updated_at`;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query(`
      SELECT id, username, email, role, full_name, stream_id, managed_stream_id, is_active, last_login, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    return result.rows;
  }

  static async findByRole(role) {
    const result = await pool.query(
      `SELECT id, username, email, role, full_name, stream_id, managed_stream_id, is_active 
       FROM users 
       WHERE role = $1 AND is_active = true 
       ORDER BY full_name`,
      [role]
    );
    return result.rows;
  }

  static async findByStream(streamId) {
    const result = await pool.query(
      `SELECT id, username, email, role, full_name, stream_id, managed_stream_id, is_active 
       FROM users 
       WHERE stream_id = $1 AND is_active = true 
       ORDER BY full_name`,
      [streamId]
    );
    return result.rows;
  }

  static async findLecturersByStream(streamId) {
    const result = await pool.query(
      `SELECT id, username, email, role, full_name, stream_id, managed_stream_id, is_active 
       FROM users 
       WHERE stream_id = $1 AND role = 'lecturer' AND is_active = true 
       ORDER BY full_name`,
      [streamId]
    );
    return result.rows;
  }

  static async findPrincipalLecturers() {
    const result = await pool.query(
      `SELECT id, username, email, role, full_name, stream_id, managed_stream_id, is_active 
       FROM users 
       WHERE role = 'principal_lecturer' AND is_active = true 
       ORDER BY full_name`
    );
    return result.rows;
  }

  static async updateLastLogin(id) {
    const result = await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, last_login',
      [id]
    );
    return result.rows[0];
  }

  static async deactivate(id) {
    const result = await pool.query(
      'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, is_active',
      [id]
    );
    return result.rows[0];
  }

  static async activate(id) {
    const result = await pool.query(
      'UPDATE users SET is_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, is_active',
      [id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, username, email',
      [id]
    );
    return result.rows[0];
  }

  static async updatePassword(id, hashedPassword) {
    const result = await pool.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
      [hashedPassword, id]
    );
    return result.rows[0];
  }

  static async searchUsers(searchTerm, filters = {}) {
    let query = `
      SELECT id, username, email, role, full_name, stream_id, managed_stream_id, is_active, created_at
      FROM users 
      WHERE (username ILIKE $1 OR email ILIKE $1 OR full_name ILIKE $1)
    `;
    const values = [`%${searchTerm}%`];
    let paramCount = 2;

    if (filters.role) {
      query += ` AND role = $${paramCount}`;
      values.push(filters.role);
      paramCount++;
    }

    if (filters.stream_id) {
      query += ` AND stream_id = $${paramCount}`;
      values.push(filters.stream_id);
      paramCount++;
    }

    if (filters.is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      values.push(filters.is_active);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getUsersStats() {
    const result = await pool.query(`
      SELECT 
        role,
        COUNT(*) as count,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_count,
        COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_count
      FROM users 
      GROUP BY role
      ORDER BY role
    `);
    return result.rows;
  }

  static async getUserWithStream(id) {
    const result = await pool.query(`
      SELECT 
        u.*,
        s.stream_name,
        s.stream_code
      FROM users u
      LEFT JOIN streams s ON u.stream_id = s.id
      WHERE u.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async assignToStream(userId, streamId) {
    const result = await pool.query(
      'UPDATE users SET stream_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, stream_id',
      [streamId, userId]
    );
    return result.rows[0];
  }

  static async assignManagedStream(userId, streamId) {
    const result = await pool.query(
      'UPDATE users SET managed_stream_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, managed_stream_id',
      [streamId, userId]
    );
    return result.rows[0];
  }

  static async isEmailTaken(email, excludeUserId = null) {
    let query = 'SELECT COUNT(*) as count FROM users WHERE email = $1';
    const values = [email];

    if (excludeUserId) {
      query += ' AND id != $2';
      values.push(excludeUserId);
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count) > 0;
  }

  static async isUsernameTaken(username, excludeUserId = null) {
    let query = 'SELECT COUNT(*) as count FROM users WHERE username = $1';
    const values = [username];

    if (excludeUserId) {
      query += ' AND id != $2';
      values.push(excludeUserId);
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count) > 0;
  }
}

module.exports = User;