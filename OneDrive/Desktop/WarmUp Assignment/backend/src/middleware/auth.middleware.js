const admin = require("../config/firebaseAdmin");

exports.verifyFirebaseToken = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({ message: "No token" });
    const token = authorization.split(" ")[1];
    if (!admin || !admin.auth) return res.status(500).json({ message: "Firebase admin not configured" });
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("verifyFirebaseToken", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
