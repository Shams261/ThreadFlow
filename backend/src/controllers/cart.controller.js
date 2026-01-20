const {
  getCart,
  addToCart,
  setQty,
  removeFromCart,
} = require("../services/cart.service");

function getUserId(req) {
  return req.header("x-user-id") || req.body.userId || "demo-user";
}

async function readCart(req, res) {
  const cart = await getCart(getUserId(req));
  res.json({ data: { cart } });
}

async function addItem(req, res) {
  const userId = getUserId(req);
  const { productId, qty = 1 } = req.body;
  if (!productId)
    return res.status(400).json({ message: "productId is required" });

  const cart = await addToCart(userId, productId, Number(qty || 1));
  res.json({ data: { cart } });
}

async function updateQty(req, res) {
  const userId = getUserId(req);
  const { productId } = req.params;
  const { qty } = req.body;

  const cart = await setQty(userId, productId, Number(qty));
  res.json({ data: { cart } });
}

async function removeItem(req, res) {
  const userId = getUserId(req);
  const { productId } = req.params;

  const cart = await removeFromCart(userId, productId);
  res.json({ data: { cart } });
}

module.exports = { readCart, addItem, updateQty, removeItem };
