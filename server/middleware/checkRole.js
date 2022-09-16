const jwt = require("jsonwebtoken");
const { fn } = require("sequelize");
const ApiError = require("../error/ApiError");
module.exports = function (role) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req.headers.authorization.split("")[1];
      if (!token) {
        return res.status(403).json({ message: "Not autorizathion" });
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (decoded.role !== role) {
        return res.status(407).json({ message: "Not allowed" });
      }
      req.user = decoded;
      next();
    } catch (e) {
      res.status(403).json({ message: "Not autorizathion" });
    }
  };
};
