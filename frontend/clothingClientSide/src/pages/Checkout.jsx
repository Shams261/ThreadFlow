import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { ACTIONS } from "../store/store";
import { products as allProducts } from "../data/products";

function findProduct(id) {
  return allProducts.find((p) => p._id === id) || null;
}

function computeTotals(cartItems) {
  const subtotal = cartItems.reduce(
    (sum, { product, qty }) => sum + (product.price || 0) * qty,
    0
  );
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

export default function Checkout() {
  const { state, dispatch } = useStore();
  const [successOrderId, setSuccessOrderId] = useState(null);

  // ---- cart view for summary
  const cartEntries = Object.entries(state.cart.items);
  const cartItems = cartEntries
    .map(([productId, qty]) => {
      const product = findProduct(productId);
      if (!product) return null;
      return { product, qty };
    })
    .filter(Boolean);

  const totals = useMemo(() => computeTotals(cartItems), [cartItems]);

  // ---- address form (simple inline)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const selectedAddress = state.addresses.list.find(
    (a) => a._id === state.addresses.selectedId
  );

  function onFormChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function addAddress(e) {
    e.preventDefault();
    // minimal validation
    if (
      !form.name ||
      !form.phone ||
      !form.line1 ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill all required address fields.");
      return;
    }
    dispatch({ type: ACTIONS.ADDRESS_ADD, payload: form });
    setForm({
      name: "",
      phone: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });
  }

  function placeOrder() {
    if (cartItems.length === 0) return;
    if (!selectedAddress) {
      alert("Please select an address to deliver the order.");
      return;
    }

    const itemsPayload = cartItems.map(({ product, qty }) => ({
      productId: product._id,
      qty,
      priceAtPurchase: product.price || 0,
    }));

    dispatch({
      type: ACTIONS.ORDER_PLACE,
      payload: {
        items: itemsPayload,
        totals,
        address: selectedAddress, // snapshot
      },
    });

    setSuccessOrderId("ok"); // simple flag
  }

  if (successOrderId) {
    return (
      <div className="alert alert-success">
        <h4 className="mb-2">Order Placed Successfully ✅</h4>
        <p className="mb-3">
          You can view your order in Profile → Order History.
        </p>
        <Link to="/products" className="btn btn-dark">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {/* Left: Addresses */}
      <div className="col-12 col-lg-7">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="mb-0">Checkout</h2>
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
          <>
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h5 className="mb-3">Select Delivery Address</h5>

                {state.addresses.list.length === 0 ? (
                  <div className="alert alert-warning mb-3">
                    No address found. Add one below.
                  </div>
                ) : (
                  <div className="d-grid gap-2 mb-3">
                    {state.addresses.list.map((a) => (
                      <label
                        key={a._id}
                        className={`border rounded p-3 d-flex gap-2 align-items-start ${
                          state.addresses.selectedId === a._id ? "bg-light" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          className="form-check-input mt-1"
                          type="radio"
                          name="selectedAddress"
                          checked={state.addresses.selectedId === a._id}
                          onChange={() =>
                            dispatch({
                              type: ACTIONS.ADDRESS_SELECT,
                              payload: a._id,
                            })
                          }
                        />

                        <div className="flex-grow-1">
                          <div className="fw-semibold">
                            {a.name} • {a.phone}
                          </div>
                          <div className="text-muted" style={{ fontSize: 14 }}>
                            {a.line1}, {a.city}, {a.state} - {a.pincode},{" "}
                            {a.country}
                          </div>

                          <div className="d-flex gap-2 mt-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                dispatch({
                                  type: ACTIONS.ADDRESS_DELETE,
                                  payload: a._id,
                                })
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <hr />

                <h6 className="text-muted text-uppercase">Add New Address</h6>
                <form onSubmit={addAddress} className="row g-2 mt-1">
                  <div className="col-12 col-md-6">
                    <input
                      className="form-control"
                      placeholder="Full name"
                      name="name"
                      value={form.name}
                      onChange={onFormChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <input
                      className="form-control"
                      placeholder="Phone"
                      name="phone"
                      value={form.phone}
                      onChange={onFormChange}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      className="form-control"
                      placeholder="Address line"
                      name="line1"
                      value={form.line1}
                      onChange={onFormChange}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <input
                      className="form-control"
                      placeholder="City"
                      name="city"
                      value={form.city}
                      onChange={onFormChange}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <input
                      className="form-control"
                      placeholder="State"
                      name="state"
                      value={form.state}
                      onChange={onFormChange}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <input
                      className="form-control"
                      placeholder="Pincode"
                      name="pincode"
                      value={form.pincode}
                      onChange={onFormChange}
                    />
                  </div>

                  <div className="col-12">
                    <button
                      className="btn btn-outline-dark w-100"
                      type="submit"
                    >
                      Add Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right: Order summary */}
      <div className="col-12 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Order Summary</h5>

            {cartItems.length === 0 ? (
              <div className="text-muted">No items to checkout.</div>
            ) : (
              <>
                <div className="d-grid gap-2 mb-3">
                  {cartItems.map(({ product, qty }) => (
                    <div
                      key={product._id}
                      className="d-flex justify-content-between"
                    >
                      <div>
                        <div className="fw-semibold" style={{ fontSize: 14 }}>
                          {product.title}
                        </div>
                        <div className="text-muted" style={{ fontSize: 12 }}>
                          Qty: {qty}
                        </div>
                      </div>
                      <div className="text-end">
                        <div style={{ fontSize: 14 }}>
                          ₹{(product.price || 0) * qty}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>₹{totals.subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span>
                    {totals.shipping === 0 ? "FREE" : `₹${totals.shipping}`}
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold">₹{totals.total}</span>
                </div>

                <button
                  className="btn btn-dark w-100"
                  onClick={placeOrder}
                  disabled={!selectedAddress}
                >
                  Place Order
                </button>

                {!selectedAddress ? (
                  <small className="text-danger d-block mt-2">
                    Select an address to enable checkout.
                  </small>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

