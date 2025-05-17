// models/pdf.js
const mongoose = require('mongoose');

// Define the PDF schema
const pdfSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  filepath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  }
});

// Export the Pdf model
module.exports = mongoose.model('Pdf', pdfSchema);