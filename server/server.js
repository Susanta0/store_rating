const express = require("express");
const app = express();
const cors = require("cors");
const { userRoutes } = require("./src/routes/usersRoutes");
const { storeRoutes } = require("./src/routes/storeRoutes");
const { ratingRoutes } = require("./src/routes/ratingsRoutes");
const { dashboardRoutes } = require("./src/routes/dashboardRoutes");
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
