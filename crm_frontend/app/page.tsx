import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center text-center"
      style={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
      }}
    >
      <div className="container py-5">
        {/* Hero Section */}
        <div className="mb-5">
          <h1 className="display-3 fw-bold text-dark mb-3">
            Welcome to <span className="text-primary">CRM System</span>
          </h1>
          <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: '600px' }}>
            A modern multi-tenant CRM platform built with Next.js and FastAPI — simple, fast, and scalable.
          </p>
        </div>

        {/* Buttons */}
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link href="/login" className="text-decoration-none">
            <button className="btn btn-primary btn-lg px-4 shadow-sm">
              <i className="bi bi-box-arrow-in-right me-2"></i> Sign In
            </button>
          </Link>
          <Link href="/register" className="text-decoration-none">
            <button className="btn btn-success btn-lg px-4 shadow-sm">
              <i className="bi bi-rocket-takeoff-fill me-2"></i> Get Started
            </button>
          </Link>
        </div>

        {/* Illustration */}
        {/* <div className="mt-5">
          <img
            src="https://undraw.co/illustrations/team"
            alt="CRM dashboard illustration"
            className="img-fluid rounded-4 shadow-lg"
            style={{ maxWidth: '700px' }}
          /> */}

        {/* </div> */}

        {/* Footer */}
        <footer className="mt-5 text-muted small">
          © {new Date().getFullYear()} CRM System — Built with ❤️ using Next.js & FastAPI
        </footer>
      </div>
    </div>
  );
}
