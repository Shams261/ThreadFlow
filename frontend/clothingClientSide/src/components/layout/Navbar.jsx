import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmed = q.trim();
    if (!trimmed) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">
          ThreadFlow
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active fw-semibold" : ""}`
                }
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active fw-semibold" : ""}`
                }
              >
                Wishlist (0)
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active fw-semibold" : ""}`
                }
              >
                Cart (0)
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active fw-semibold" : ""}`
                }
              >
                Profile
              </NavLink>
            </li>
          </ul>

          <form className="d-flex" onSubmit={handleSubmit} role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search products…"
              aria-label="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btn btn-outline-dark" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
