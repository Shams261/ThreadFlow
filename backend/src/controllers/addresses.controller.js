const {
  getAddressBook,
  addAddress,
  updateAddress,
  deleteAddress,
  selectAddress,
} = require("../services/addresses.service");

function getUserId(req) {
  return req.header("x-user-id") || req.body.userId || "demo-user";
}

async function readAddresses(req, res) {
  const book = await getAddressBook(getUserId(req));
  res.json({ data: { addressBook: book } });
}

async function create(req, res) {
  const userId = getUserId(req);
  const book = await addAddress(userId, req.body);
  res.status(201).json({ data: { addressBook: book } });
}

async function update(req, res) {
  const userId = getUserId(req);
  const { addressId } = req.params;
  const book = await updateAddress(userId, addressId, req.body);
  if (!book) return res.status(404).json({ message: "Address not found" });
  res.json({ data: { addressBook: book } });
}

async function remove(req, res) {
  const userId = getUserId(req);
  const { addressId } = req.params;
  const book = await deleteAddress(userId, addressId);
  res.json({ data: { addressBook: book } });
}

async function select(req, res) {
  const userId = getUserId(req);
  const { addressId } = req.params;
  const book = await selectAddress(userId, addressId);
  if (!book) return res.status(404).json({ message: "Address not found" });
  res.json({ data: { addressBook: book } });
}

module.exports = { readAddresses, create, update, remove, select };
