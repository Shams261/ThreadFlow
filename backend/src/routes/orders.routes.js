const router = require("express").Router();
const { asyncWrap } = require("../middlewares/asyncWrap");
const {
  placeOrder,
  getOrders,
  getSingleOrder,
} = require("../controllers/orders.controller");

router.post("/", asyncWrap(placeOrder));
router.get("/", asyncWrap(getOrders));
router.get("/:orderId", asyncWrap(getSingleOrder));

module.exports = router;
