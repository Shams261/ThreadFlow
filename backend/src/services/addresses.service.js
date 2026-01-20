const AddressBook = require("../models/Address");

async function getAddressBook(userId) {
  let book = await AddressBook.findOne({ userId });
  if (!book) {
    book = await AddressBook.create({ userId, addresses: [] });
  }
  return book;
}

async function addAddress(userId, address) {
  const book = await getAddressBook(userId);
  book.addresses.push(address);
  await book.save();
  return book;
}

async function updateAddress(userId, addressId, updates) {
  const book = await getAddressBook(userId);
  const addr = book.addresses.id(addressId);
  if (!addr) return null;

  Object.assign(addr, updates);
  await book.save();
  return book;
}

async function deleteAddress(userId, addressId) {
  const book = await getAddressBook(userId);
  book.addresses = book.addresses.filter(
    (a) => String(a._id) !== String(addressId),
  );

  // if deleted selected, clear it
  if (
    book.selectedAddressId &&
    String(book.selectedAddressId) === String(addressId)
  ) {
    book.selectedAddressId = null;
  }

  await book.save();
  return book;
}

async function selectAddress(userId, addressId) {
  const book = await getAddressBook(userId);
  const exists = book.addresses.some(
    (a) => String(a._id) === String(addressId),
  );
  if (!exists) return null;
  book.selectedAddressId = addressId;
  await book.save();
  return book;
}

module.exports = {
  getAddressBook,
  addAddress,
  updateAddress,
  deleteAddress,
  selectAddress,
};
