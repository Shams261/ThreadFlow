const mongoose = require("mongoose");

async function connectDB(uri) {
  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () =>
    console.log("✅ MongoDB connected"),
  );
  mongoose.connection.on("error", (err) =>
    console.error("❌ MongoDB connection error:", err.message),
  );

  await mongoose.connect(uri);
}

module.exports = { connectDB };
