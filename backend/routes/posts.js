const express = require('express');
const multer = require("multer");
const Post = require('../models/post');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    const error = isValid ? null : new Error("Invalid MIME type");
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});

const upload = multer({ storage });

// Create Post
router.post("/", checkAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const url = `${req.protocol}://${req.get("host")}`;
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: `${url}/images/${req.file.filename}`,
      creator: req.userData.userId
    });

    const createdPost = await post.save();
    res.status(201).json({
      message: "Post added successfully",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    });
  } catch (error) {
    console.error("Post creation failed:", error);
    res.status(500).json({ message: "Creating post failed" });
  }
});

// Get All Posts with Pagination
router.get("/", async (req, res) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.currentpage;

  try {
    const postQuery = Post.find();
    if (pageSize && currentPage) {
      postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    const posts = await postQuery;
    const count = await Post.countDocuments();

    res.status(200).json({
      message: "Posts fetched successfully",
      posts,
      maxPosts: count
    });
  } catch (error) {
    console.error("Fetching posts failed:", error);
    res.status(500).json({ message: "Fetching posts failed" });
  }
});

// Get Single Post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Fetching single post failed:", error);
    res.status(500).json({ message: "Fetching post failed" });
  }
});

// Update Post
router.put("/:id", checkAuth, upload.single("image"), async (req, res) => {
  try {
    let imagePath = req.body.imagePath; // Default to current image path if no new file
    if (req.file) {
      // If a new image is uploaded, create the new image path
      const url = `${req.protocol}://${req.get("host")}`;
      imagePath = `${url}/images/${req.file.filename}`;
    }

    // Find the post by ID
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the current user is authorized to update this post
    if (post.creator.toString() !== req.userData.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update post fields
    post.title = req.body.title;
    post.content = req.body.content;

    // Only update the image path if a new image was uploaded
    if (req.file) {
      post.imagePath = imagePath;
    }

    // Save the updated post to the database
    await post.save();

    res.status(200).json({ message: "Post updated", imagePath });
  } catch (error) {
    console.error("Post update failed:", error);
    res.status(500).json({ message: "Post update failed" });
  }
});

// Delete Post
router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.creator.toString() !== req.userData.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.error("Post deletion failed:", error);
    res.status(500).json({ message: "Deleting post failed" });
  }
});

module.exports = router;