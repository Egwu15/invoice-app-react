import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <AuthLayout title="Reset password" subtitle="Mock flow: we’ll simulate sending a reset email.">
      <form onSubmit={onSubmit} className="auth-form">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button className="primary" type="submit">
          Send Reset Link
        </button>
        {submitted ? <p className="form-success">If this account exists, a reset link was sent.</p> : null}
      </form>
      <p className="auth-inline-link">
        <Link to="/login">Back to sign in</Link>
      </p>
    </AuthLayout>
  );
}
