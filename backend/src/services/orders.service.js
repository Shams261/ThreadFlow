const Order = require("../models/Order");
const Product = require("../models/Product");

function calcPricing(subtotal) {
  // simple, deterministic rules for assignment
  const shipping = subtotal >= 1999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + shipping + tax;
  return { shipping, tax, total };
}

async function createOrder({ userId, items, address }) {
  // items expected: [{ productId, qty }]
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error("Order must contain at least one item");
    err.status = 400;
    throw err;
  }

  // Fetch products from DB (never trust client prices)
  const ids = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids } });

  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const normalizedItems = [];
  let subtotal = 0;

  for (const i of items) {
    const pid = String(i.productId);
    const qty = Number(i.qty);

    if (!qty || qty < 1) {
      const err = new Error("Invalid quantity");
      err.status = 400;
      throw err;
    }

    const p = productMap.get(pid);
    if (!p) {
      const err = new Error(`Product not found: ${pid}`);
      err.status = 404;
      throw err;
    }

    if (p.inStock === false) {
      const err = new Error(`Out of stock: ${p.title}`);
      err.status = 400;
      throw err;
    }

    const price = Number(p.price || 0);
    const lineTotal = price * qty;

    subtotal += lineTotal;

    normalizedItems.push({
      productId: p._id,
      title: p.title,
      brand: p.brand,
      price,
      qty,
      lineTotal,
      image: Array.isArray(p.images) ? p.images[0] || "" : "",
    });
  }

  const { shipping, tax, total } = calcPricing(subtotal);

  const order = await Order.create({
    userId,
    items: normalizedItems,
    subtotal,
    shipping,
    tax,
    total,
    address,
    status: "PLACED",
  });

  return order;
}

async function listOrders(userId) {
  return Order.find({ userId }).sort({ createdAt: -1 });
}

async function getOrderById({ userId, orderId }) {
  return Order.findOne({ _id: orderId, userId });
}

module.exports = { createOrder, listOrders, getOrderById };
