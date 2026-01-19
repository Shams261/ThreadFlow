import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { ACTIONS } from "../store/store";
import { useToast } from "../store/toastProvider";
import Loader from "../components/common/Loader";

import { fetchProducts } from "../api/products.api";
import { placeOrder as placeOrderApi } from "../api/orders.api";

// Keep totals aligned with backend rules (orders.service.js)
function calcPricing(subtotal) {
  const shipping = subtotal >= 1999 ? 0 : subtotal > 0 ? 99 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;
  return { shipping, tax, total };
}

function computeTotals(cartItems) {
  const subtotal = cartItems.reduce(
    (sum, { product, qty }) => sum + Number(product.price || 0) * qty,
    0,
  );
  const { shipping, tax, total } = calcPricing(subtotal);
  return { subtotal, shipping, tax, total };
}

const EMPTY_FORM = {
  name: "",
  phone: "",
  line1: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function Checkout() {
  const { state, dispatch } = useStore();
  const { showToast } = useToast();

  const [success, setSuccess] = useState(false);
  const [placing, setPlacing] = useState(false);

  // Products needed to map cart ids -> product objects
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Address form (add + edit)
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    let alive = true;

    async function loadProducts() {
      try {
        setProductsLoading(true);
        const p = await fetchProducts();
        if (!alive) return;
        setProducts(p);
      } catch (e) {
        showToast(e.message || "Failed to load products", { type: "danger" });
      } finally {
        if (alive) setProductsLoading(false);
      }
    }

    loadProducts();
    return () => {
      alive = false;
    };
  }, [showToast]);

  const productMap = useMemo(() => {
    const m = new Map();
    products.forEach((p) => m.set(p._id, p));
    return m;
  }, [products]);

  // Cart summary
  const cartEntries = Object.entries(state.cart.items); // [ [productId, qty], ... ]
  const cartItems = cartEntries
    .map(([productId, qty]) => {
      const product = productMap.get(productId);
      if (!product) return null;
      return { product, qty };
    })
    .filter(Boolean);

  const totals = useMemo(() => computeTotals(cartItems), [cartItems]);

  const selectedAddress = state.addresses.list.find(
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
    showToast("Editing address", { type: "info", duration: 1500 });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function submitAddress(e) {
    e.preventDefault();

    if (!validateAddress(form)) {
      showToast("Please fill all required address fields.", {
        type: "warning",
      });
      return;
    }

    if (editingId) {
      dispatch({
        type: ACTIONS.ADDRESS_UPDATE,
        payload: { _id: editingId, updates: form },
      });
      showToast("Address updated ✅", { type: "success" });
      cancelEdit();
      return;
    }

    dispatch({ type: ACTIONS.ADDRESS_ADD, payload: form });
    showToast("Address added ✅", { type: "success" });
    setForm(EMPTY_FORM);
  }

  function clearCartSafely() {
    // uses only existing actions, no need for CART_CLEAR
    for (const [productId] of Object.entries(state.cart.items)) {
      dispatch({ type: ACTIONS.CART_REMOVE, payload: productId });
    }
  }

  async function placeOrder() {
    if (cartItems.length === 0) return;

    if (!selectedAddress) {
      showToast("Please select a delivery address.", { type: "warning" });
      return;
    }

    try {
      setPlacing(true);

      const payload = {
        items: cartItems.map(({ product, qty }) => ({
          productId: product._id,
          qty,
        })),
        address: {
          fullName: selectedAddress.name,
          phone: selectedAddress.phone,
          line1: selectedAddress.line1,
          line2: "",
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          country: selectedAddress.country || "India",
        },
      };

      const order = await placeOrderApi(payload);

      // optional: keep local state history if your reducer supports it
      try {
        dispatch({ type: ACTIONS.ORDER_PLACE, payload: order });
      } catch (_) {}

      clearCartSafely();

      showToast("Order placed successfully ✅", { type: "success" });
      setSuccess(true);
    } catch (e) {
      showToast(e.message || "Failed to place order", { type: "danger" });
    } finally {
      setPlacing(false);
    }
  }

  if (productsLoading) return <Loader label="Loading checkout..." />;

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
                          onChange={() => {
                            dispatch({
                              type: ACTIONS.ADDRESS_SELECT,
                              payload: a._id,
                            });
                            showToast("Address selected ✅", {
                              type: "success",
                            });
                          }}
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
                              onClick={() => {
                                dispatch({
                                  type: ACTIONS.ADDRESS_DELETE,
                                  payload: a._id,
                                });
                                showToast("Address deleted", {
                                  type: "warning",
                                });
                              }}
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

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tax</span>
                  <span>₹{totals.tax}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold">₹{totals.total}</span>
                </div>

                <button
                  className="btn btn-dark w-100"
                  onClick={placeOrder}
                  disabled={!selectedAddress || placing}
                >
                  {placing ? "Placing..." : "Place Order"}
                </button>

                {!selectedAddress ? (
                  <small className="text-danger d-block mt-2">
                    Select an address to place order.
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
