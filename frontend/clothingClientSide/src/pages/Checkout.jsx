import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/storeProvider"; // custom hook
import { ACTIONS } from "../store/store"; // action types
import { products as allProducts } from "../data/products"; // mock products data

function findProduct(id) {
  // helper to find product by id
  return allProducts.find((p) => p._id === id) || null; // return null if not found
}

function computeTotals(cartItems) {
  // helper to compute subtotal, shipping, total
  const subtotal = cartItems.reduce(
    (sum, { product, qty }) => sum + (product.price || 0) * qty,
    0,
  );
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

const EMPTY_FORM = {
  // empty address form
  name: "",
  phone: "",
  line1: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function Checkout() {
  // main Checkout component
  const { state, dispatch } = useStore(); // global state and dispatch
  const [success, setSuccess] = useState(false); // order success state

  // ---- cart summary
  const cartEntries = Object.entries(state.cart.items); // [ [productId, qty], ... ]
  const cartItems = cartEntries
    .map(([productId, qty]) => {
      const product = findProduct(productId);
      if (!product) return null;
      return { product, qty };
    })
    .filter(Boolean);

  const totals = useMemo(() => computeTotals(cartItems), [cartItems]); // memoized totals so that it doesn't recompute on every render

  // ---- address form (add + edit)
  const [form, setForm] = useState(EMPTY_FORM); // address form state
  const [editingId, setEditingId] = useState(null); // currently editing address id

  const selectedAddress = state.addresses.list.find(
    // selected address object
    (a) => a._id === state.addresses.selectedId,
  );

  function onFormChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function validateAddress(f) {
    return (
      f.name.trim() &&
      f.phone.trim() &&
      f.line1.trim() &&
      f.city.trim() &&
      f.state.trim() &&
      f.pincode.trim()
    );
  }

  function startEdit(address) {
    // populate form for editing
    setEditingId(address._id);
    setForm({
      name: address.name || "",
      phone: address.phone || "",
      line1: address.line1 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "India",
    });
  }

  function cancelEdit() {
    // cancel editing
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function submitAddress(e) {
    // handle address form submission
    e.preventDefault();

    if (!validateAddress(form)) {
      alert("Please fill all required address fields.");
      return;
    }

    if (editingId) {
      dispatch({
        type: ACTIONS.ADDRESS_UPDATE,
        payload: { _id: editingId, updates: form },
      });
      cancelEdit();
      return;
    }

    dispatch({ type: ACTIONS.ADDRESS_ADD, payload: form });
    setForm(EMPTY_FORM);
  }

  function placeOrder() {
    // handle order placement
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

    setSuccess(true);
  }

  if (success) {
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
      {/* Left: Address section */}
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
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Delivery Address</h5>
                {selectedAddress ? (
                  <span className="badge bg-success">Selected</span>
                ) : (
                  <span className="badge bg-warning text-dark">Select one</span>
                )}
              </div>

              {state.addresses.list.length === 0 ? (
                <div className="alert alert-warning mb-3">
                  No address found. Add one below.
                </div>
              ) : (
                <div className="d-grid gap-2 mb-3">
                  {state.addresses.list.map((a) => {
                    const isSelected = state.addresses.selectedId === a._id;

                    return (
                      <div
                        key={a._id}
                        className={`border rounded p-3 d-flex gap-2 align-items-start shadow-sm bg-white ${
                          isSelected ? "border-dark" : ""
                        }`}
                      >
                        <input
                          className="form-check-input mt-1"
                          type="radio"
                          name="selectedAddress"
                          checked={isSelected}
                          onChange={() =>
                            dispatch({
                              type: ACTIONS.ADDRESS_SELECT,
                              payload: a._id,
                            })
                          }
                        />

                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <div className="fw-semibold">
                                {a.name} <span className="text-muted">•</span>{" "}
                                {a.phone}
                              </div>
                              <div
                                className="text-muted"
                                style={{ fontSize: 14 }}
                              >
                                {a.line1}, {a.city}, {a.state} - {a.pincode},{" "}
                                {a.country}
                              </div>
                            </div>

                            {isSelected ? (
                              <span className="badge bg-dark">
                                Deliver here
                              </span>
                            ) : null}
                          </div>

                          <div className="d-flex gap-2 mt-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-dark"
                              onClick={() => startEdit(a)}
                            >
                              Edit
                            </button>

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
                      </div>
                    );
                  })}
                </div>
              )}

              <hr />

              <h6 className="text-muted text-uppercase mb-2">
                {editingId ? "Edit Address" : "Add New Address"}
              </h6>

              <form onSubmit={submitAddress} className="row g-2">
                <div className="col-12 col-md-6">
                  <input
                    className="form-control"
                    placeholder="Full name*"
                    name="name"
                    value={form.name}
                    onChange={onFormChange}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <input
                    className="form-control"
                    placeholder="Phone*"
                    name="phone"
                    value={form.phone}
                    onChange={onFormChange}
                  />
                </div>
                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder="Address line*"
                    name="line1"
                    value={form.line1}
                    onChange={onFormChange}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <input
                    className="form-control"
                    placeholder="City*"
                    name="city"
                    value={form.city}
                    onChange={onFormChange}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <input
                    className="form-control"
                    placeholder="State*"
                    name="state"
                    value={form.state}
                    onChange={onFormChange}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <input
                    className="form-control"
                    placeholder="Pincode*"
                    name="pincode"
                    value={form.pincode}
                    onChange={onFormChange}
                  />
                </div>

                <div className="col-12 d-grid gap-2">
                  <button className="btn btn-dark" type="submit">
                    {editingId ? "Save Changes" : "Add Address"}
                  </button>

                  {editingId ? (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>

                <small className="text-muted">* Required fields.</small>
              </form>
            </div>
          </div>
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
                      <div className="text-end" style={{ fontSize: 14 }}>
                        ₹{(product.price || 0) * qty}
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
                    Select an address to Place order.
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
