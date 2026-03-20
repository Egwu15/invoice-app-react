import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-modern">
        <aside className="auth-panel">
          <div className="auth-logo" />
          <h2>InvoiceFlow</h2>
          <p>Modern invoice management with clear status tracking and lightweight workflows.</p>
        </aside>

        <div className="auth-card">
          <h1>{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
          <p className="auth-footer-note">
            Sign in with an account from the backend API, or create one here first.
          </p>
          <p className="auth-footer-note">
            New here? <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
