const express = require("express");
const app = express();
const cors = require("cors");
const { userRoutes } = require("./src/routes/usersRoutes");
const { storeRoutes } = require("./src/routes/storeRoutes");
const { ratingRoutes } = require("./src/routes/ratingsRoutes");
const { dashboardRoutes } = require("./src/routes/dashboardRoutes");
const { initializeDatabase } = require("./src/config/dbInit");
require("dotenv").config();

// Configure CORS
app.use(cors({
  origin: ["https://store-rating-six.vercel.app/","http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", dashboardRoutes);

const PORT = process.env.PORT || 5000;

// Initialize database before starting the server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
