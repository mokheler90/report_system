const { pool } = require('../config/database');

class Rating {
  static async create(ratingData) {
    const { rater_id, rated_entity_type, rated_entity_id, rating_value, review_text, is_anonymous } = ratingData;
    const result = await pool.query(
      `INSERT INTO ratings (rater_id, rated_entity_type, rated_entity_id, rating_value, review_text, is_anonymous) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [rater_id, rated_entity_type, rated_entity_id, rating_value, review_text, is_anonymous || false]
    );
    return result.rows[0];
  }

  static async findByEntity(rated_entity_type, rated_entity_id) {
    const result = await pool.query(`
      SELECT r.*, u.full_name as rater_name, u.email as rater_email 
      FROM ratings r 
      LEFT JOIN users u ON r.rater_id = u.id 
      WHERE r.rated_entity_type = $1 AND r.rated_entity_id = $2 
      AND r.is_approved = true
      ORDER BY r.created_at DESC
    `, [rated_entity_type, rated_entity_id]);
    return result.rows;
  }

  static async findByUser(userId) {
    const result = await pool.query(`
      SELECT r.*, 
        CASE 
          WHEN r.rated_entity_type = 'course' THEN c.course_name
          WHEN r.rated_entity_type = 'lecturer' THEN u.full_name
          WHEN r.rated_entity_type = 'class' THEN cl.class_name
          WHEN r.rated_entity_type = 'stream' THEN s.stream_name
        END as entity_name
      FROM ratings r
      LEFT JOIN courses c ON r.rated_entity_type = 'course' AND r.rated_entity_id = c.id
      LEFT JOIN users u ON r.rated_entity_type = 'lecturer' AND r.rated_entity_id = u.id
      LEFT JOIN classes cl ON r.rated_entity_type = 'class' AND r.rated_entity_id = cl.id
      LEFT JOIN streams s ON r.rated_entity_type = 'stream' AND r.rated_entity_id = s.id
      WHERE r.rater_id = $1 
      ORDER BY r.created_at DESC
    `, [userId]);
    return result.rows;
  }

  static async findByUserAndEntity(userId, rated_entity_type, rated_entity_id) {
    const result = await pool.query(
      `SELECT * FROM ratings 
       WHERE rater_id = $1 AND rated_entity_type = $2 AND rated_entity_id = $3`,
      [userId, rated_entity_type, rated_entity_id]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM ratings WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async getAverageRating(rated_entity_type, rated_entity_id) {
    const result = await pool.query(
      `SELECT 
        AVG(rating_value) as average_rating,
        COUNT(*) as rating_count,
        COUNT(review_text) as review_count
       FROM ratings 
       WHERE rated_entity_type = $1 AND rated_entity_id = $2 
       AND is_approved = true`,
      [rated_entity_type, rated_entity_id]
    );
    
    const data = result.rows[0];
    return {
      average_rating: data.average_rating ? parseFloat(data.average_rating) : 0,
      rating_count: parseInt(data.rating_count),
      review_count: parseInt(data.review_count)
    };
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
    const query = `UPDATE ratings SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM ratings WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async getRatingStats(rated_entity_type, rated_entity_id) {
    const result = await pool.query(`
      SELECT 
        rating_value,
        COUNT(*) as count
      FROM ratings 
      WHERE rated_entity_type = $1 AND rated_entity_id = $2 
      AND is_approved = true
      GROUP BY rating_value 
      ORDER BY rating_value DESC
    `, [rated_entity_type, rated_entity_id]);
    
    return result.rows;
  }
}

module.exports = Rating;