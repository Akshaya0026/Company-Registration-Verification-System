const mongoose = require("mongoose");

const SocialSchema = new mongoose.Schema({
  website: String,
  linkedin: String,
  twitter: String,
  facebook: String
}, { _id: false });

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: String,
  foundedDate: Date,
  logoUrl: String,
  bannerUrl: String,
  social: SocialSchema,
  createdBy: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Company", CompanySchema);
