const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-__v");

    if (!user) return res.sendStatus(401);

    req.user = user;
    next();
  } catch {
    res.sendStatus(401);
  }
};
