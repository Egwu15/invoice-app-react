import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppShell() {
  const { currentUser, logout, theme, toggleTheme } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <header className="mobile-appbar">
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
        <div className="mobile-brand">
          <div className="logo-panel mobile-logo" aria-hidden="true" />
          <strong>InvoiceFlow</strong>
        </div>
        <div className="avatar-chip mobile-avatar">{currentUser?.avatarInitials || 'U'}</div>
      </header>

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="logo-panel" aria-label="InvoiceFlow home" />
          <div className="brand-copy">
            <strong>InvoiceFlow</strong>
            <span>Billing workspace</span>
          </div>
          <button className="sidebar-close" type="button" onClick={closeMenu} aria-label="Close navigation">
            ✕
          </button>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>
            Dashboard
          </NavLink>
          <NavLink to="/invoices" className="nav-link" onClick={closeMenu}>
            Invoices
          </NavLink>
          <NavLink to="/profile" className="nav-link" onClick={closeMenu}>
            Profile
          </NavLink>
          <NavLink to="/settings" className="nav-link" onClick={closeMenu}>
            Settings
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="avatar-chip">{currentUser?.avatarInitials || 'U'}</div>
          <div className="user-meta">
            <strong>{currentUser?.fullName}</strong>
            <span>{currentUser?.email}</span>
          </div>
          <div className="side-actions">
            <button onClick={toggleTheme} className="icon-button" type="button">
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            <button
              onClick={() => {
                closeMenu();
                onLogout();
              }}
              className="icon-button"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {menuOpen ? <button className="sidebar-backdrop" type="button" onClick={closeMenu} aria-label="Close menu" /> : null}

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}
