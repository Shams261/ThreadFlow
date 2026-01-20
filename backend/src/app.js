const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const { notFound } = require("./middlewares/notFound");
const { errorHandler } = require("./middlewares/errorHandler");

const productRoutes = require("./routes/products.routes");
const categoryRoutes = require("./routes/categories.routes");
const cartRoutes = require("./routes/cart.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const addressesRoutes = require("./routes/addresses.routes");
const ordersRoutes = require("./routes/orders.routes");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/addresses", addressesRoutes);
app.use("/api/orders", ordersRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
