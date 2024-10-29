const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  fileSize: Number,
  fileType: String
});

module.exports = mongoose.model('File', fileSchema);
