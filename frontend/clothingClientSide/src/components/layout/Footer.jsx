import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-top bg-light mt-5">
      <div className="container py-4">
        <div className="row gy-4">
          {/* Brand */}
          <div className="col-12 col-md-4">
            <h5 className="fw-bold mb-2">ThreadFlow</h5>
            <p className="text-muted mb-0">
              AI-powered fashion picks. Clean fits. Smarter shopping.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-4">
            <h6 className="text-uppercase text-muted fw-semibold mb-2">
              Quick Links
            </h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-1">
                <Link className="text-decoration-none text-dark" to="/products">
                  Products
                </Link>
              </li>
              <li className="mb-1">
                <Link className="text-decoration-none text-dark" to="/wishlist">
                  Wishlist
                </Link>
              </li>
              <li className="mb-1">
                <Link className="text-decoration-none text-dark" to="/cart">
                  Cart
                </Link>
              </li>
              <li>
                <Link className="text-decoration-none text-dark" to="/profile">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal + Social */}
          <div className="col-6 col-md-4">
            <h6 className="text-uppercase text-muted fw-semibold mb-2">
              Legal
            </h6>
            <ul className="list-unstyled mb-3">
              <li className="mb-1">
                <a className="text-decoration-none text-dark" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="text-decoration-none text-dark" href="#">
                  Terms & Conditions
                </a>
              </li>
            </ul>

            <div className="d-flex gap-2">
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
          </div>
        </div>

        <hr className="my-4" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
          <small className="text-muted">
            © {year} ThreadFlow. All rights reserved.
          </small>
          <small className="text-muted">Built with ❤️</small>
        </div>
      </div>
    </footer>
  );
}
