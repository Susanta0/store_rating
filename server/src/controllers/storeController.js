const dbConnection = require("../config/db");

const storeController = {
  addStore: async (req, res) => {
    const { name, email, address, store_owner_id } = req.body;
    try {
      const result = await dbConnection.query(
        "INSERT INTO stores(name, email, address, store_owner_id) VALUES ($1, $2, $3, $4) RETURNING*",
        [name, email, address, store_owner_id]
      );
      return res
        .status(201)
        .json({ message: "Store added successfully", data: result.rows[0] });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getStores: async (req, res) => {
    const { name, address } = req.query;
    let query = `
    SELECT 
      s.id, 
      s.name, 
      s.email, 
      s.address, 
      COALESCE(AVG(r.rating), 0) as overall_rating,
      json_build_object(
        'id', ur.id,
        'rating', ur.rating
      ) as user_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
  `;
  const values = [req.user.id];
    if (name || address) {
      query += " WHERE ";
      const conditions = [];
      if (name) {
        conditions.push(`s.name ILIKE $${values.length + 1}`);
        values.push(`%${name}%`);
      }
      if (address) {
        conditions.push(`s.address ILIKE $${values.length + 1}`);
        values.push(`%${address}%`);
      }
      query += conditions.join(" AND ");
    }
    query += " GROUP BY s.id, ur.id, ur.rating";
    try {
      const result = await dbConnection.query(query, values);
      return res.json(result.rows);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getStoreRatings: async (req, res) => {
    const { storeId } = req.params;
    try {
      const store = await dbConnection.query(
        "SELECT store_owner_id FROM stores WHERE id = $1",
        [storeId]
      );
      if (store.rows[0].store_owner_id !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      const result = await dbConnection.query(
        `
      SELECT u.name, r.rating
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
    `,
        [storeId]
      );
      const avgRating = await dbConnection.query(
        "SELECT AVG(rating) as average FROM ratings WHERE store_id = $1",
        [storeId]
      );
      return res.json({
        ratings: result.rows,
        average: avgRating.rows[0].average,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = { storeController };