const express = require('express');
const Post = require('../models/post');
const multer = require("multer");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid Mime Type");
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});

const upload = multer({ storage });

router.post("/", checkAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const url = req.protocol + '://' + req.get("host");
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
        id: createdPost._id.toString(),
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
        creator: createdPost.creator
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  const pageSize = parseInt(req.query.pagesize, 10);
  const currentPage = parseInt(req.query.currentpage, 10);

  if (!pageSize || !currentPage) {
    return res.status(400).json({ message: "Page size and current page are required" });
  }

  try {
    const postQuery = Post.find();
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);

    const documents = await postQuery;
    const count = await Post.countDocuments();

    const transformedPosts = documents.map(post => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      imagePath: post.imagePath,
      creator: post.creator
    }));

    res.status(200).json({
      message: "Posts fetched successfully",
      posts: transformedPosts,
      maxPosts: count
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:id", checkAuth, upload.single("image"), async (req, res) => {
  try {
    let imagePath = req.body.imagePath;

    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }

    // Update only if the post's creator matches the logged-in user
    const updatedPost = await Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId }, // Ensure the post belongs to the user
      {
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
      }
    );

    if (updatedPost.nModified > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Not Authorized!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

router.delete("/:id", checkAuth, async (req, res) => {
  try {
    // Delete only if the post's creator matches the logged-in user
    const result = await Post.deleteOne({ _id: req.params.id, creator: req.userData.userId });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Post deleted!" });
    } else {
      res.status(401).json({ message: "Not Authorized!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
