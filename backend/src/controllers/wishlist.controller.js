const {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} = require("../services/wishlist.service");

function getUserId(req) {
  return req.header("x-user-id") || req.body.userId || "demo-user";
}

async function readWishlist(req, res) {
  const wl = await getWishlist(getUserId(req));
  res.json({ data: { wishlist: wl } });
}

async function toggle(req, res) {
  const userId = getUserId(req);
  const { productId } = req.params;
  const wl = await toggleWishlist(userId, productId);
  res.json({ data: { wishlist: wl } });
}

async function remove(req, res) {
  const userId = getUserId(req);
  const { productId } = req.params;
  const wl = await removeFromWishlist(userId, productId);
  res.json({ data: { wishlist: wl } });
}

module.exports = { readWishlist, toggle, remove };
