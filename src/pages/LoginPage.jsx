import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, currentUser } = useAuth();
  const [email, setEmail] = useState('alex@invoiceflow.dev');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = (event) => {
    event.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate(location.state?.from || '/dashboard', { replace: true });
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Manage your invoices in one focused workspace.">
      <form onSubmit={onSubmit} className="auth-form">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary" type="submit">
          Sign In
        </button>
      </form>
      <p className="auth-inline-link">
        <Link to="/reset-password">Forgot password?</Link>
      </p>
    </AuthLayout>
  );
}
