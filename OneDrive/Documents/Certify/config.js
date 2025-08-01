require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001, // Changed to 3001 to avoid conflict
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET
};
