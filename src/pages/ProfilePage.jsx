import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { currentUser, updateProfile } = useAuth();
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    fullName: currentUser.fullName,
    company: currentUser.company,
    role: currentUser.role,
    location: currentUser.location,
  });

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = (event) => {
    event.preventDefault();
    updateProfile(form);
    setMessage('Profile updated.');
  };

  return (
    <section>
      <div className="section-header">
        <h1>Profile</h1>
        <p>Keep your identity and billing details current.</p>
      </div>
      <article className="card profile-card">
        <div className="profile-avatar-lg">{currentUser.avatarInitials}</div>
        <div>
          <h2>{currentUser.fullName}</h2>
          <p>{currentUser.email}</p>
        </div>
      </article>
      <article className="card">
        <form onSubmit={onSubmit} className="auth-form">
          <label>
            Full Name
            <input value={form.fullName} onChange={(e) => onChange('fullName', e.target.value)} required />
          </label>
          <label>
            Company
            <input value={form.company} onChange={(e) => onChange('company', e.target.value)} required />
          </label>
          <label>
            Role
            <input value={form.role} onChange={(e) => onChange('role', e.target.value)} required />
          </label>
          <label>
            Location
            <input value={form.location} onChange={(e) => onChange('location', e.target.value)} required />
          </label>
          {message ? <p className="form-success">{message}</p> : null}
          <button className="primary" type="submit">
            Save Profile
          </button>
        </form>
      </article>
    </section>
  );
}
