import { httpGet, httpPost } from "./http";

export async function placeOrder(payload) {
  const json = await httpPost("/api/orders", payload);
  return json.data.order;
}

export async function fetchOrders() {
  const json = await httpGet("/api/orders");
  return json.data.orders;
}
