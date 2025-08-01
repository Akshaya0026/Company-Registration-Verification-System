const Certificate = require('../models/Certificate');

exports.getCerts = async (req, res) => {
  try {
    const certs = await Certificate.find({ user: req.user._id });
    res.json(certs);
  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
};

exports.getCert = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ _id: req.params.id, user: req.user._id });
    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    res.json(cert);
  } catch (err) {
    console.error('Error fetching certificate:', err);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
};

exports.addCert = async (req, res) => {
  try {
    const cert = await Certificate.create({ ...req.body, user: req.user._id });
    res.status(201).json(cert);
  } catch (err) {
    console.error('Error adding certificate:', err);
    res.status(500).json({ error: 'Failed to add certificate' });
  }
};

exports.updateCert = async (req, res) => {
  try {
    const cert = await Certificate.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    res.json(cert);
  } catch (err) {
    console.error('Error updating certificate:', err);
    res.status(500).json({ error: 'Failed to update certificate' });
  }
};

exports.deleteCert = async (req, res) => {
  try {
    const cert = await Certificate.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    res.json({ message: "Certificate deleted" });
  } catch (err) {
    console.error('Error deleting certificate:', err);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
};
