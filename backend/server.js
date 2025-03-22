const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const pool = new Pool({
  user: "postgres",
  host: "database",
  database: "task_manager",
  password: "postgres", 
  port: 5432,
});

app.use(cors());
app.use(express.json());

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// Add a new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, status } = req.body;

    if (!title || !status) {
      return res.status(400).json({ error: "Title and status are required" });
    }

    const validStatuses = ["To Do", "In Progress", "Closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    await pool.query("INSERT INTO tasks (title, status) VALUES ($1, $2)", [title, status]);
    res.json({ message: "Task added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding task" });
  }
});

// Update task status
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query("UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *", [status, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task updated", task: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating task" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));