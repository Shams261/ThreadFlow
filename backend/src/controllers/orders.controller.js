const {
  createOrder,
  listOrders,
  getOrderById,
} = require("../services/orders.service");

function getUserId(req) {
  return (
    req.header("x-user-id") ||
    req.query.userId ||
    req.body?.userId || //  optional chaining
    "demo-user"
  );
}

async function placeOrder(req, res) {
  const userId = getUserId(req);
  const { items, address } = req.body;

  if (!address) return res.status(400).json({ message: "Address is required" });

  const order = await createOrder({ userId, items, address });
  res.status(201).json({ data: { order } });
}

async function getOrders(req, res) {
  const userId = getUserId(req);
  const orders = await listOrders(userId);
  res.json({ data: { orders } });
}

async function getSingleOrder(req, res) {
  const userId = getUserId(req);
  const { orderId } = req.params;

  const order = await getOrderById({ userId, orderId });
  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json({ data: { order } });
}

module.exports = { placeOrder, getOrders, getSingleOrder };
