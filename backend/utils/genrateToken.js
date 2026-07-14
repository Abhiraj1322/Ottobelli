const jwt = require("jsonwebtoken");


 
const generateToken = (user) => {
  // We embed the id, email, and role inside the token payload
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" } // Token automatically expires in 2 hours
  );
};

module.exports = generateToken;
 