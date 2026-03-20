const path = require("path");
const express = require("express");
const multer = require("multer");
const uploadFile = require("./services/storage.service");
const postModel = require("./models/post.model");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Serve uploaded images
const uploadsPath = path.join(__dirname, "..", "uploads");
app.use("/uploads", express.static(uploadsPath));

// Serve the frontend build (SPA) so client-side routes like /about and /contact work
const clientBuildPath = path.join(
  __dirname,
  "..",
  "..",
  "Frontend",
  "Frontend",
  "dist",
);
app.use(express.static(clientBuildPath));

const upload = multer({ storage: multer.memoryStorage() });

app.post("/create-post", upload.single("image"), async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const result = await uploadFile(req.file.buffer, req.file.originalname);

    const post = await postModel.create({
      Image: result.url,
      caption: req.body.caption || "",
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post failed:", error);
    return res.status(500).json({ message: "Failed to create post", error: error.message });
  }
});

app.get("/posts", async (req, res) => {
  const posts = await postModel.find();
  return res.status(200).json({
    message: "Posts fetched successfully",
    posts,
  });
});

// Fallback to client-side routing for any other GET requests (e.g. /about, /contact)
// Using a regex avoids path-to-regexp parsing issues with wildcard patterns.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

module.exports = app;
