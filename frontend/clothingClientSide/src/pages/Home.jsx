import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-4 fw-bold mb-4">Welcome to ThreadFlow</h1>
      <p className="lead mb-4">
        Your ultimate destination for trendy and stylish clothing. Explore our
        latest collections and find your perfect outfit today!
      </p>
      <Link to="/products" className="btn btn-primary btn-lg">
        Shop Now
      </Link>
    </div>
  );
}
