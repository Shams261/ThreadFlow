const router = require("express").Router();
const { asyncWrap } = require("../middlewares/asyncWrap");
const {
  readWishlist,
  toggle,
  remove,
} = require("../controllers/wishlist.controller");

router.get("/", asyncWrap(readWishlist));
router.post("/:productId/toggle", asyncWrap(toggle));
router.delete("/:productId", asyncWrap(remove));

module.exports = router;
