import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, currentUser } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await register(form);
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate('/dashboard', { replace: true });
  };

  return (
    <AuthLayout title="Create account" subtitle="Set up your workspace in under a minute.">
      <form onSubmit={onSubmit} className="auth-form">
        <label>
          Full Name
          <input
            value={form.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => onChange('email', e.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            minLength={8}
            value={form.password}
            onChange={(e) => onChange('password', e.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <p className="auth-inline-link">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
