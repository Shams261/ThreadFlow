function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err);

 
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const status = err.status || 500;
  const message = err.status ? err.message : "Server error";

  res.status(status).json({ message, error: err.message });
}

module.exports = { errorHandler };
