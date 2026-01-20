const Wishlist = require("../models/Wishlist");

async function getWishlist(userId) {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, productIds: [] });
  }
  return wishlist;
}

async function toggleWishlist(userId, productId) {
  const wl = await getWishlist(userId);
  const pid = String(productId);
  const has = wl.productIds.some((x) => String(x) === pid);

  if (has) wl.productIds = wl.productIds.filter((x) => String(x) !== pid);
  else wl.productIds.push(productId);

  await wl.save();
  return wl;
}

async function removeFromWishlist(userId, productId) {
  const wl = await getWishlist(userId);
  wl.productIds = wl.productIds.filter((x) => String(x) !== String(productId));
  await wl.save();
  return wl;
}

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };
