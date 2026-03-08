import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInvoices } from '../context/InvoiceContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useAuth();
  const { invoices } = useInvoices();
  const [message, setMessage] = useState('');

  const exportData = () => {
    const blob = new Blob([JSON.stringify(invoices, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'invoices-export.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage('Mock export completed.');
  };

  return (
    <section>
      <div className="section-header">
        <h1>Settings</h1>
        <p>Personalize your workspace behavior and data controls.</p>
      </div>
      <article className="card settings-list">
        <div className="setting-row">
          <div>
            <h3>Theme</h3>
            <p>Current mode: {theme}</p>
          </div>
          <button className="ghost" type="button" onClick={toggleTheme}>
            Toggle Theme
          </button>
        </div>
        <div className="setting-row">
          <div>
            <h3>Data Export</h3>
            <p>Download all invoices as JSON for migration or backup.</p>
          </div>
          <button className="ghost" type="button" onClick={exportData}>
            Export
          </button>
        </div>
        <div className="setting-row">
          <div>
            <h3>Notifications</h3>
            <p>Mocked: Payment reminders and due date digests.</p>
          </div>
          <button className="ghost" type="button" disabled>
            Coming Soon
          </button>
        </div>
      </article>
      {message ? <p className="form-success">{message}</p> : null}
    </section>
  );
}
