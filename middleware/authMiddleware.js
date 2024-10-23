const jwt = require("jsonwebtoken");
const Auth = (requiredRole) => {
  return (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      req.user = decoded.user;

      // Check user role
      if (requiredRole && req.user.role !== requiredRole) {
        return res
          .status(403)
          .json({ msg: "Access denied, insufficient permissions" });
      }

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ msg: "Token has expired, please log in again" });
      }
      res.status(401).json({ msg: err.message });
    }
  };
};

module.exports = {
  Auth,
};
