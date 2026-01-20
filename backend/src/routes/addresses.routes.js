const router = require("express").Router();
const { asyncWrap } = require("../middlewares/asyncWrap");
const {
  readAddresses,
  create,
  update,
  remove,
  select,
} = require("../controllers/addresses.controller");

router.get("/", asyncWrap(readAddresses));
router.post("/", asyncWrap(create));
router.put("/:addressId", asyncWrap(update));
router.delete("/:addressId", asyncWrap(remove));
router.put("/:addressId/select", asyncWrap(select));

module.exports = router;
