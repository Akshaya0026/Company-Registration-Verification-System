const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  issuer: { type: String },
  tags: [String],
  issueDate: { type: Date },
  expiryDate: { type: Date },
  certificateUrl: { type: String }, // Link to the certificate
  pdfFile: { 
    data: Buffer,
    contentType: String,
    filename: String
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('Certificate', certificateSchema);
