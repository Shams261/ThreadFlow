import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer border-top mt-auto py-3">
      <div className="container py-4">
        <div className="row gy-4 text-center text-md-start">
          {/* Brand */}
          <div className="col-12 col-md-4">
            <h5 className="fw-bold mb-2 fs-4">FitFinder</h5>
            <p className="text-muted mb-0">
              Find your perfect fit. Clean styles. Smarter shopping.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-2">
            <h6 className="text-uppercase text-muted fw-semibold mb-3">Shop</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link className="text-decoration-none text-dark" to="/products">
                  All Products
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  className="text-decoration-none text-dark"
                  to="/products?category=cat-men"
                >
                  Men
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  className="text-decoration-none text-dark"
                  to="/products?category=cat-women"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  className="text-decoration-none text-dark"
                  to="/products?category=cat-kids"
                >
                  Kids
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-6 col-md-2">
            <h6 className="text-uppercase text-muted fw-semibold mb-3">
              Account
            </h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link className="text-decoration-none text-dark" to="/profile">
                  My Profile
                </Link>
              </li>
              <li className="mb-2">
                <Link className="text-decoration-none text-dark" to="/wishlist">
                  Wishlist
                </Link>
              </li>
              <li className="mb-2">
                <Link className="text-decoration-none text-dark" to="/cart">
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  className="text-decoration-none text-dark"
                  to="/profile/orders"
                >
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal + Social */}
          <div className="col-12 col-md-4 text-center text-md-end">
            <h6 className="text-uppercase text-muted fw-semibold mb-3">
              Follow Us
            </h6>
            <div className="d-flex gap-2 justify-content-center justify-content-md-end mb-3">
              <a
                className="btn btn-outline-dark btn-sm"
                href="#"
                aria-label="Twitter"
              >
                X
              </a>
              <a
                className="btn btn-outline-dark btn-sm"
                href="#"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                className="btn btn-outline-dark btn-sm"
                href="#"
                aria-label="LinkedIn"
              >
                in
              </a>
            </div>
            <Link to="/privacy" className="text-decoration-none text-dark me-3">
              Privacy
            </Link>
            <Link to="/terms" className="text-decoration-none text-dark">
              Terms
            </Link>
          </div>
        </div>

        <hr className="my-4" />

        <div className="text-center">
          <small className="text-muted">
            © {year} FitFinder. All rights reserved. Built with ❤️.
          </small>
        </div>
      </div>
    </footer>
  );
}
