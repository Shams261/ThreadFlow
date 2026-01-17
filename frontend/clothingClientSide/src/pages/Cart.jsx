import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useStore } from "../store/storeProvider"; // import global store
import { ACTIONS } from "../store/store"; // import action types
import { products as allProducts } from "../data/products"; // import all products data

function findProduct(productId) {
  // this function helps to find product by ID
  return allProducts.find((p) => p._id === productId) || null; // return product or null if not found
}

export default function Cart() {
  // Cart page component
  const navigate = useNavigate(); // for navigation
  const { state, dispatch } = useStore(); // get global state and dispatch from store provider

  const cartEntries = Object.entries(state.cart.items); // get cart items as [productId, qty] pairs because cart items are stored as an object

  const cartItems = cartEntries // map over cart entries to get full product details
    .map(([productId, qty]) => {
      // for each [productId, qty] pair
      const product = findProduct(productId); // find the product by ID
      if (!product) return null;
      return { product, qty };
    })
    .filter(Boolean);

  const summary = useMemo(() => {
    // calculate price summary using useMemo for optimization
    const subtotal = cartItems.reduce(
      (sum, { product, qty }) => sum + (product.price || 0) * qty,
      0
    );

    // Shipping is free for this example
    const shipping = subtotal > 0 ? 0 : 0; // will modify later if needed
    const total = subtotal + shipping;

    return { subtotal, shipping, total }; // return summary object
  }, [cartItems]);

  return (
    <div className="row g-3">
      {/* Cart items in the left column */}
      <div className="col-12 col-lg-8">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Cart</h2>
          <span className="badge bg-light text-dark border">
            {cartItems.length} items
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="alert alert-info">
            Your cart is empty.{" "}
            <Link to="/products" className="alert-link">
              Shop now
            </Link>
            .
          </div>
        ) : (
          <div className="d-grid gap-3">
            {cartItems.map(({ product, qty }) => (
              <div className="card shadow-sm" key={product._id}>
                <div className="card-body">
                  <div className="row g-3 align-items-center">
                    <div className="col-12 col-md-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="img-fluid rounded"
                          style={{
                            height: 120,
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="bg-light rounded d-flex align-items-center justify-content-center"
                          style={{ height: 120 }}
                        >
                          <span className="text-muted">No image</span>
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <h6 className="mb-1">{product.title}</h6>
                      <p className="text-muted mb-2" style={{ fontSize: 14 }}>
                        {product.brand}
                      </p>

                      <div className="d-flex align-items-baseline gap-2">
                        <span className="fw-bold">₹{product.price}</span>
                        {product.originalPrice ? (
                          <span className="text-muted text-decoration-line-through">
                            ₹{product.originalPrice}
                          </span>
                        ) : null}
                      </div>

                      {!product.inStock ? (
                        <div className="mt-2">
                          <span className="badge bg-danger">Out of stock</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="col-12 col-md-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted">Qty</span>
                        <span className="fw-semibold">{qty}</span>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-dark btn-sm"
                          type="button"
                          onClick={() =>
                            dispatch({
                              // decrease quantity action
                              type: ACTIONS.CART_DEC,
                              payload: product._id,
                            })
                          }
                        >
                          −
                        </button>

                        <button
                          className="btn btn-outline-dark btn-sm"
                          type="button"
                          disabled={!product.inStock}
                          onClick={() =>
                            dispatch({
                              // increase quantity action
                              type: ACTIONS.CART_INC,
                              payload: product._id,
                            })
                          }
                        >
                          +
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm ms-auto"
                          type="button"
                          onClick={() =>
                            dispatch({
                              type: ACTIONS.CART_REMOVE, // action to remove item from cart
                              payload: product._id,
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>

                      <div className="d-grid mt-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() =>
                            dispatch({
                              type: ACTIONS.MOVE_CART_TO_WISHLIST, // action to move item from cart to wishlist
                              payload: product._id,
                            })
                          }
                        >
                          Move to Wishlist
                        </button>
                      </div>

                      <div className="mt-2 text-end">
                        <small className="text-muted">
                          Item total: ₹{(product.price || 0) * qty}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Price details */}
      <div className="col-12 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Price Details</h5>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span>₹{summary.subtotal}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Shipping</span>
              <span>
                {summary.shipping === 0 ? "FREE" : `₹${summary.shipping}`}
              </span>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-3">
              <span className="fw-bold">Total</span>
              <span className="fw-bold">₹{summary.total}</span>
            </div>

            <button
              className="btn btn-dark w-100"
              disabled={cartItems.length === 0}
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </button>

            <small className="text-muted d-block mt-2">
              What are you waiting for, place order now 😀.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
