const dbConnection = require("../config/db");

const ratingController = {
  submitRating: async (req, res) => {
    const { store_id, rating } = req.body;
    try {
      const result = await dbConnection.query(
        "INSERT INTO ratings(user_id, store_id, rating) VALUES($1, $2, $3) RETURNING *",
        [req.user.id, store_id, rating]
      );
      return res.status(201).json({
        message: "Rating submitted successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  updateRating: async (req, res) => {
    const { ratingId } = req.params;
    const { rating } = req.body;
    try {
      const result = await dbConnection.query(
        "UPDATE ratings SET rating=$1 WHERE id=$2 AND user_id=$3 RETURNING *",
        [rating, ratingId, req.user.id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Rating not found" });
      }
      return res.status(200).json({
        message: "Rating updated successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = { ratingController };
