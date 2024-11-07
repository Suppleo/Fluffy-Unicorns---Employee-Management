require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const knex = require("knex")(require("./knexfile").development);
const authenticateToken = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

// Authentication endpoints
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await knex("users").where({ username }).first();
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Employee endpoints
app.get("/employee", async (req, res) => {
  try {
    const employees = await knex("employees").select("*");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/employee/:id", async (req, res) => {
  try {
    const employee = await knex("employees")
      .where({ id: parseInt(req.params.id) }) // Parse id as integer
      .first();
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/employee", authenticateToken, async (req, res) => {
  try {
    // Remove any id from the request body to let the database auto-generate it
    const { id, ...employeeData } = req.body;

    const result = await knex("employees").insert(employeeData).returning("*");
    const newEmployee = result[0]; // Get the complete employee record
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Database error:", error); // Add logging for debugging
    res.status(400).json({ message: error.message });
  }
});

app.patch("/employee/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id); // Parse id as integer
    // Remove id from the update data
    const { id: _, ...updateData } = req.body;

    await knex("employees").where({ id }).update(updateData);
    const updatedEmployee = await knex("employees").where({ id }).first();
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/employee/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id); // Parse id as integer
    await knex("employees").where({ id }).del();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
