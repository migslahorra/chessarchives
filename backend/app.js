const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const pdfRoutes = require('./routes/pdfs');
const Pdf = require('./models/pdf');  // Import the Pdf model for MongoDB

const app = express();

// MongoDB connection
mongoose.connect(
  "mongodb+srv://migsdev_chessarchives:chessarchives_migsdev_11.25.2003@cluster0.r2tzsdg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection failed:', err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static image files
app.use("/images", express.static(path.join(__dirname, "images")));

// Serve PDF files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// Set up Multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pdfs/');  // Specify the folder where PDFs will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Use a unique name for the file
  }
});

const upload = multer({ storage: storage });

// Route for uploading PDFs
app.post('/api/pdfs', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  // Save PDF metadata to MongoDB
  const newPdf = new Pdf({
    filename: req.file.originalname,
    filepath: req.file.path,  // Path to the uploaded file
    fileSize: req.file.size
  });

  newPdf.save()
    .then((savedPdf) => {
      res.status(200).json({
        message: 'File uploaded successfully',
        file: savedPdf  // Return saved PDF metadata
      });
    })
    .catch((err) => {
      console.error('Error saving PDF:', err);
      res.status(500).json({ message: 'Error saving PDF to MongoDB', error: err });
    });
});

// Routes
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/pdfs", pdfRoutes);  // Use the PDF routes for additional operations like GET and DELETE

// Export the app
module.exports = app;