const express = require('express');
const multer = require('multer');
const Pdf = require('../models/pdf');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/pdfs'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/', upload.single('pdf'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');

  const newPdf = new Pdf({
    filename: req.file.originalname,
    filepath: req.file.filename,
    fileSize: req.file.size
  });

  newPdf.save()
    .then(saved => res.status(201).json(saved))
    .catch(err => res.status(500).json({ message: 'Error saving PDF', error: err }));
});

router.get('/', (req, res) => {
  Pdf.find()
    .then(pdfs => res.status(200).json(pdfs))
    .catch(err => res.status(500).json({ message: 'Error retrieving PDFs', error: err }));
});

router.get('/download/:storedFilename', (req, res) => {
  const storedFilename = req.params.storedFilename;
  const filePath = path.join(__dirname, '..', 'uploads', 'pdfs', storedFilename);
  res.download(filePath, err => {
    if (err) res.status(404).json({ message: 'File not found' });
  });
});

module.exports = router;