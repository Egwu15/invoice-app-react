import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>404</h1>
        <p>This route does not exist.</p>
        <Link className="primary button-link" to="/dashboard">
          Go to dashboard
        </Link>
      </div>
    </section>
  );
}
