const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// GET ALL TODOS
app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM todos ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch todos",
    });
  }
});

// CREATE TODO
app.post("/todos", async (req, res) => {
  try {
    const { task, priority } = req.body;

    const result = await pool.query(
      `INSERT INTO todos (task, priority)
       VALUES ($1, $2)
       RETURNING *`,
      [task, priority || "Medium"]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create todo",
    });
  }
});

// UPDATE TASK
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { task, priority } = req.body;

    const result = await pool.query(
      `UPDATE todos
       SET task=$1, priority=$2
       WHERE id=$3
       RETURNING *`,
      [task, priority, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to update todo",
    });
  }
});

// MARK COMPLETE
app.put("/todos/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE todos
       SET completed=true,
           completed_at=NOW()
       WHERE id=$1
       RETURNING *`,
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to complete todo",
    });
  }
});

// DELETE TASK
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM todos WHERE id=$1",
      [id]
    );

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to delete todo",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});