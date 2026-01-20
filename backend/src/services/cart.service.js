const Cart = require("../models/Cart");

async function getCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
}

async function addToCart(userId, productId, qty = 1) {
  const cart = await getCart(userId);
  const idx = cart.items.findIndex(
    (i) => String(i.productId) === String(productId),
  );
  if (idx >= 0) cart.items[idx].qty += qty;
  else cart.items.push({ productId, qty });
  await cart.save();
  return cart;
}

async function setQty(userId, productId, qty) {
  const cart = await getCart(userId);
  const idx = cart.items.findIndex(
    (i) => String(i.productId) === String(productId),
  );
  if (idx < 0) return cart;

  if (qty <= 0) cart.items.splice(idx, 1);
  else cart.items[idx].qty = qty;

  await cart.save();
  return cart;
}

async function removeFromCart(userId, productId) {
  const cart = await getCart(userId);
  cart.items = cart.items.filter(
    (i) => String(i.productId) !== String(productId),
  );
  await cart.save();
  return cart;
}

module.exports = { getCart, addToCart, setQty, removeFromCart };
