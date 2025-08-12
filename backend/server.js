const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// In-memory storage (para simplicidad)
let posts = [];
let postId = 1;

// Routes
app.get("/api/posts", (req, res) => {
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  res.json(sortedPosts);
});

app.post("/api/posts", (req, res) => {
  const { content } = req.body;

  if (!content || content.length > 280) {
    return res
      .status(400)
      .json({ error: "El mensaje debe tener entre 1 y 280 caracteres" });
  }

  const post = {
    id: postId++,
    content: content.trim(),
    timestamp: new Date().toISOString(),
    author: "Usuario ESPE",
  };

  posts.push(post);
  res.status(201).json(post);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
  });
}

module.exports = app;
