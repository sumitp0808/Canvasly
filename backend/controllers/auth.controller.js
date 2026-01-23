const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const verifyGoogleToken = require("../utils/googleVerify");

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const payload = await verifyGoogleToken(token);

    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
      });
    }

    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token: jwtToken, user });
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token" });
  }
};

module.exports = {googleLogin}
