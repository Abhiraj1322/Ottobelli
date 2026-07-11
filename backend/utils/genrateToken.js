const jwt = require("jsonwebtoken");
 
// Short-lived token sent to the client and used on every request
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};
 
// Long-lived token stored as httpOnly cookie, used to silently get new access tokens
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
};
 
module.exports = { generateAccessToken, generateRefreshToken };
 