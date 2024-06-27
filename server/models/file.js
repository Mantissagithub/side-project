const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  fileType: String, // e.g., 'jpg', 'pdf', 'py', etc.
  filePath: String,
});

module.exports = mongoose.model('File', fileSchema);
