const dbConnection = require("../config/db");

const dashboardController = {
  getDashboard: async (req, res) => {
    try {
      const totalUsers = await dbConnection.query("SELECT COUNT(*) FROM users");
      const totalStores = await dbConnection.query(
        "SELECT COUNT(*) FROM stores"
      );
      const totalRatings = await dbConnection.query(
        "SELECT COUNT(*) FROM ratings"
      );
      return res.json({
        totalUsers: totalUsers.rows[0].count,
        totalStores: totalStores.rows[0].count,
        totalRatings: totalRatings.rows[0].count,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = { dashboardController };