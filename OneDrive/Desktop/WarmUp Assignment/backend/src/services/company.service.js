const Company = require("../models/company.model");

exports.create = async (payload) => {
  const doc = await Company.create(payload);
  return doc;
};

exports.findAll = async ({ page = 1, q = "" }) => {
  const limit = 10;
  const skip = (page - 1) * limit;
  const filter = q ? { name: { $regex: q, $options: "i" } } : {};
  const items = await Company.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
  const total = await Company.countDocuments(filter);
  return { items, total, page };
};
