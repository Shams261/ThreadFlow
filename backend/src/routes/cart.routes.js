const router = require("express").Router();
const { asyncWrap } = require("../middlewares/asyncWrap");
const {
  readCart,
  addItem,
  updateQty,
  removeItem,
} = require("../controllers/cart.controller");

router.get("/", asyncWrap(readCart));
router.post("/items", asyncWrap(addItem));
router.patch("/items/:productId", asyncWrap(updateQty));
router.delete("/items/:productId", asyncWrap(removeItem));

module.exports = router;
