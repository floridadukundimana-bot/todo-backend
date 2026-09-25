require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// GET all todos
app.get("/todos", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM todos ORDER BY id ASC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

// POST new todo
app.post("/todos", async (req, res) => {
    try {
        const { task, priority } = req.body;

        const result = await pool.query(
            `INSERT INTO todos (task, priority)
             VALUES ($1, $2)
             RETURNING *`,
            [task, priority]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add todo" });
    }
});

// UPDATE todo
app.put("/todos/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { task, priority } = req.body;

        const result = await pool.query(
            `UPDATE todos
             SET task = $1,
                 priority = $2
             WHERE id = $3
             RETURNING *`,
            [task, priority, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update todo" });
    }
});

// MARK TODO AS COMPLETED
app.put("/todos/:id/complete", async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const result = await pool.query(
            `UPDATE todos
             SET completed = true,
                 completed_at = NOW()
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to complete todo" });
    }
});

// DELETE todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        await pool.query(
            "DELETE FROM todos WHERE id = $1",
            [id]
        );

        res.json({ message: "Todo deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete todo" });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});