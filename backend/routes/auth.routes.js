const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { googleLogin } = require("../controllers/auth.controller");

router.post("/google", googleLogin);
router.get("/me", auth, (req, res) => {
    res.json(req.user);
});

module.exports = router;
