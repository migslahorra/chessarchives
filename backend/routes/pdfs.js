// routes/pdfs.js
const express = require('express');
const multer = require('multer');
const Pdf = require('../models/pdf');  // Import the Pdf model
const path = require('path');
const router = express.Router();

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pdfs');  // Store the PDFs in the 'uploads/pdfs' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Generate a unique filename
  }
});

const upload = multer({ storage: storage });

// POST route for uploading PDFs
router.post('/', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const newPdf = new Pdf({
    filename: req.file.originalname,
    filepath: req.file.path,  // Path to the uploaded file
    fileSize: req.file.size
  });

  // Save the PDF metadata to MongoDB
  newPdf.save()
    .then((savedPdf) => {
      // Return the saved PDF metadata in the response
      res.status(201).json(savedPdf);
    })
    .catch((err) => {
      console.error('Error saving PDF:', err);
      res.status(500).json({ message: 'Error saving PDF', error: err });
    });
});

// GET route to retrieve all PDFs (for listing them)
router.get('/', (req, res) => {
  Pdf.find()
    .then(pdfs => res.status(200).json(pdfs))
    .catch(err => res.status(500).json({ message: 'Error retrieving PDFs', error: err }));
});

// DELETE route to delete a PDF by its ID
router.delete('/:id', (req, res) => {
  Pdf.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({ message: 'PDF deleted successfully' }))
    .catch(err => res.status(500).json({ message: 'Error deleting PDF', error: err }));
});

module.exports = router;
