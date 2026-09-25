app.get("/todos", async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM todos ORDER BY id ASC"
      );
  
      res.json(result.rows);
    } catch (err) {
      console.error("GET TODOS ERROR:", err);
  
      res.status(500).json({
        error: String(err),
        code: err.code,
        detail: err.detail,
      });
    }
  });