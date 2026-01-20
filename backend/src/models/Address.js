const mongoose = require("mongoose");

const addressItemSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
  },
  { timestamps: true },
);

const addressBookSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    addresses: { type: [addressItemSchema], default: [] },
    selectedAddressId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AddressBook", addressBookSchema);
