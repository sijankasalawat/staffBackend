const jwt = require("jsonwebtoken");

const authGuard = (req, res, next) => {
  // check if auth header is present
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing",
    });
  }

  // split the auth header and get the token
  const token = authHeader.split(" ")[1];
  // check if token is present
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token missing",
    });
  }

  // verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user data to the request object
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authGuard;
