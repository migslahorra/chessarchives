const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const pdfRoutes = require('./routes/pdfs');
const Pdf = require('./models/pdf');

const app = express();

mongoose.connect(
  "mongodb+srv://migsdev_chessarchives:chessarchives_migsdev_11.25.2003@cluster0.r2tzsdg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection failed:', err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pdfs/');  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage });

app.post('/api/pdfs', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const newPdf = new Pdf({
    filename: req.file.originalname,
    filepath: req.file.path,  
    fileSize: req.file.size
  });

  newPdf.save()
    .then((savedPdf) => {
      res.status(200).json({
        message: 'File uploaded successfully',
        file: savedPdf  
      });
    })
    .catch((err) => {
      console.error('Error saving PDF:', err);
      res.status(500).json({ message: 'Error saving PDF to MongoDB', error: err });
    });
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/pdfs", pdfRoutes);

module.exports = app;