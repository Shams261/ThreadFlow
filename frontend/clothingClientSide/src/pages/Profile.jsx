import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { useToast } from "../store/toastProvider";
import { ACTIONS } from "../store/store";
import Loader from "../components/common/Loader";

import { fetchOrders } from "../api/orders.api";

const EMPTY_FORM = {
  name: "",
  phone: "",
  line1: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function Profile() {
  const { state, dispatch } = useStore();
  const { showToast } = useToast();

  // Address form (add/edit)
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  // Orders from backend
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadOrders() {
      try {
        setLoadingOrders(true);
        const data = await fetchOrders();
        if (!alive) return;
        setOrders(data);
      } catch (e) {
        showToast(e.message || "Failed to load orders", { type: "danger" });
      } finally {
        if (alive) setLoadingOrders(false);
      }
    }

    loadOrders();
    return () => {
      alive = false;
    };
  }, [showToast]);

  const latestOrders = useMemo(() => orders.slice(0, 5), [orders]);

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

  if (loadingOrders) return <Loader label="Loading profile..." />;

  return (
    <div className="container py-4">
      <div className="row g-3">
        {/* Left: Profile + Address Management */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h4 className="mb-1">Shams Tabrez</h4>
              <p className="text-muted mb-3">
                shamsshoaib261@gmail.com • +91-XXXXXXXXXX
              </p>

              <div className="d-flex gap-2">
                <span className="badge bg-light text-dark border">
                  Saved Addresses: {state.addresses.list.length}
                </span>
                <span className="badge bg-light text-dark border">
                  Orders: {orders.length}
                </span>
              </div>

              <Link to="/products" className="btn btn-outline-dark w-100 mt-3">
                Browse Products
              </Link>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Address Book</h5>
                {state.addresses.selectedId ? (
                  <span className="badge bg-success">Selected</span>
                ) : (
                  <span className="badge bg-warning text-dark">Select one</span>
                )}
              </div>

              {state.addresses.list.length === 0 ? (
                <div className="alert alert-warning">
                  No saved address. Add one below.
                </div>
              ) : (
                <div className="d-grid gap-2 mb-3">
                  {state.addresses.list.map((a) => {
                    const isSelected = state.addresses.selectedId === a._id;

                    return (
                      <div
                        key={a._id}
                        className={`border rounded p-3 shadow-sm bg-white ${
                          isSelected ? "border-dark" : ""
                        }`}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <label
                            className="d-flex gap-2 align-items-start"
                            style={{ cursor: "pointer" }}
                          >
                            <input
                              className="form-check-input mt-1"
                              type="radio"
                              name="selectedAddressProfile"
                              checked={isSelected}
                              onChange={() => {
                                dispatch({
                                  type: ACTIONS.ADDRESS_SELECT,
                                  payload: a._id,
                                });
                                showToast("Default address selected ✅", {
                                  type: "success",
                                });
                              }}
                            />
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
                          </label>

                          {isSelected ? (
                            <span className="badge bg-dark">Default</span>
                          ) : null}
                        </div>

                        <div className="d-flex gap-2 mt-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => {
                              startEdit(a);
                              showToast("Editing address", {
                                type: "info",
                                duration: 1500,
                              });
                            }}
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
                              showToast("Address deleted", { type: "warning" });
                            }}
                          >
                            Delete
                          </button>
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
                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder="Full name*"
                    name="name"
                    value={form.name}
                    onChange={onFormChange}
                  />
                </div>

                <div className="col-12">
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

              <Link to="/checkout" className="btn btn-outline-dark w-100 mt-3">
                Go to Checkout
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Order History */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Order History</h5>
                <span className="badge bg-light text-dark border">
                  {orders.length} orders
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="alert alert-info mb-0">
                  No orders yet.{" "}
                  <Link to="/products" className="alert-link">
                    Shop now
                  </Link>
                  .
                </div>
              ) : (
                <div className="d-grid gap-2">
                  {latestOrders.map((o) => (
                    <div key={o._id} className="border rounded p-3">
                      <div className="d-flex justify-content-between">
                        <div className="fw-semibold">Order: {o._id}</div>
                        <span className="badge bg-success">{o.status}</span>
                      </div>

                      <div className="text-muted" style={{ fontSize: 13 }}>
                        {new Date(o.createdAt).toLocaleString()}
                      </div>

                      <div className="mt-2 text-muted" style={{ fontSize: 14 }}>
                        Items: {o.items.reduce((s, it) => s + it.qty, 0)} •
                        Total: ₹{o.total}
                      </div>

                      <div className="mt-2 text-muted" style={{ fontSize: 13 }}>
                        Delivered to: {o.address.fullName}, {o.address.city}
                      </div>

                      <ul className="mb-0 mt-2" style={{ fontSize: 13 }}>
                        {o.items.slice(0, 3).map((it) => (
                          <li key={String(it.productId)}>
                            {it.title} — Qty {it.qty}
                          </li>
                        ))}
                        {o.items.length > 3 ? <li>…more</li> : null}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
