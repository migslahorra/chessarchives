const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  filename: { type: String, required: true }, 
  filepath: { type: String, required: true }, 
  fileSize: { type: Number, required: true }
});

module.exports = mongoose.model('Pdf', pdfSchema);