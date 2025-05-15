const dbConnection = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userController = {
  signup: async (req, res) => {
    const { name, email, address, password, role } = req.body;
    const validRole = ["user", "store_owner"];

    if (role === "system_administrator" && !req.user?.role === "system_administrator") {
      return res.status(403).json({ message: "Only system administrators can assign the system_administrator role" });
    }

    if (!validRole.includes(role) && role !== "system_administrator") {
      return res.status(400).json({ message: "Invalid role" });
    }
    try {
      if (password.length < 8 || password.length > 16) {
        return res
          .status(400)
          .json({
            message: "Password must be between 8 and 16 characters long",
          });
      }
      if (!/[A-Z]/.test(password)) {
        return res
          .status(400)
          .json({
            message: "Password must contain at least one uppercase letter",
          });
      }
      if (!/[!@#$%^&*]/.test(password)) {
        return res
          .status(400)
          .json({
            message:
              "Password must contain at least one special character (!@#$%^&*)",
          });
      }

      const roleResult = await dbConnection.query(
        "SELECT id FROM roles WHERE name = $1",
        [role]
      );
      if (roleResult.rows.length === 0) {
        return res.status(400).json({ message: "Invalid role" });
      }
      const role_id = roleResult.rows[0].id;
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await dbConnection.query(
        "INSERT INTO users (name, email, address, password, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, email, address, hashedPassword, role_id]
      );
      const newUser = result.rows[0];
      return res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      // Fetch user with role name
      const result = await dbConnection.query(
        "SELECT u.*, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = $1",
        [email]
      );
  
      if (result.rows.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }
  
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role, // Use role name from query
        },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );
  
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role // Include role name
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  
  updatePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
      const user = await dbConnection.query(
        "SELECT * FROM users WHERE id = $1",
        [req.user.id]
      );
      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        user.rows[0].password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (newPassword.length < 8 || newPassword.length > 16) {
        return res
          .status(400)
          .json({
            message: "Password must be between 8 and 16 characters long",
          });
      }
      if (!/[A-Z]/.test(newPassword)) {
        return res
          .status(400)
          .json({
            message: "Password must contain at least one uppercase letter",
          });
      }
      if (!/[!@#$%^&*]/.test(newPassword)) {
        return res
          .status(400)
          .json({
            message:
              "Password must contain at least one special character (!@#$%^&*)",
          });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await dbConnection.query("UPDATE users SET password = $1 WHERE id = $2", [
        hashedPassword,
        req.user.id,
      ]);
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getUsers: async (req, res) => {
    const { name, email, address, role } = req.query;
    let query =
      "SELECT u.id, u.name, u.email, u.address, r.name as role FROM users u JOIN roles r ON u.role_id = r.id";
    const values = [];
    if (name || email || address || role) {
      query += " WHERE ";
      const conditions = [];
      if (name) {
        conditions.push(`u.name ILIKE $${values.length + 1}`);
        values.push(`%${name}%`);
      }
      if (email) {
        conditions.push(`u.email ILIKE $${values.length + 1}`);
        values.push(`%${email}%`);
      }
      if (address) {
        conditions.push(`u.address ILIKE $${values.length + 1}`);
        values.push(`%${address}%`);
      }
      if (role) {
        conditions.push(`r.name = $${values.length + 1}`);
        values.push(role);
      }
      query += conditions.join(" AND ");
    }
    try {
      const result = await dbConnection.query(query, values);
      
      // For store owners, fetch their store ratings
      const usersWithRatings = await Promise.all(
        result.rows.map(async (user) => {
          if (user.role === 'store_owner') {
            // Get store associated with this owner
            const storeResult = await dbConnection.query(
              "SELECT id FROM stores WHERE store_owner_id = $1",
              [user.id]
            );
            
            if (storeResult.rows.length > 0) {
              // Get average rating for the store
              const ratingResult = await dbConnection.query(
                "SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = $1",
                [storeResult.rows[0].id]
              );
              
              return {
                ...user,
                rating: ratingResult.rows[0].average_rating || 0
              };
            }
          }
          return user;
        })
      );
      
      return res.json(usersWithRatings);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = { userController };