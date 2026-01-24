const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/board.controller");

router.post("/", auth, controller.createBoard);
router.post("/join", auth, controller.joinBoard);
router.get("/", auth, controller.getMyBoards);
router.get("/:id", auth, controller.getBoardById);
router.put("/:id/elements", auth, controller.saveBoardElements);

module.exports = router;
