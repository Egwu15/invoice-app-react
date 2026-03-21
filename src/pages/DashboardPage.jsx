import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusPill from '../components/StatusPill';
import { useAuth } from '../context/AuthContext';
import { useInvoices } from '../context/InvoiceContext';
import { authHeader, apiRequest } from '../utils/api';
import { formatCurrency, formatDate, getInvoiceTotal } from '../utils/invoice';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { invoices, isLoading, error } = useInvoices();
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPending: 0,
    totalPaid: 0,
    totalRevenue: 0,
  });
  const [statsError, setStatsError] = useState('');
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      if (!currentUser?.token) {
        setStats({
          totalInvoices: 0,
          totalPending: 0,
          totalPaid: 0,
          totalRevenue: 0,
        });
        setStatsError('');
        setIsStatsLoading(false);
        return;
      }

      setIsStatsLoading(true);
      setStatsError('');

      try {
        const response = await apiRequest('/Invoice/stats', {
          headers: authHeader(currentUser.token),
        });

        setStats({
          totalInvoices: Number(response.totalInvoices) || 0,
          totalPending: Number(response.totalPending) || 0,
          totalPaid: Number(response.totalPaid) || 0,
          totalRevenue: Number(response.totalRevenue) || 0,
        });
      } catch (loadError) {
        setStatsError(loadError.message || 'Unable to load dashboard stats.');
      } finally {
        setIsStatsLoading(false);
      }
    };

    loadStats();
  }, [currentUser?.token]);

  return (
    <section>
      <div className="section-header">
        <h1>Dashboard</h1>
        <p>Snapshot of invoice performance and payment health.</p>
      </div>
      {isLoading ? <p className="empty-state">Loading invoices...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {isStatsLoading ? <p className="empty-state">Loading dashboard stats...</p> : null}
      {statsError ? <p className="form-error">{statsError}</p> : null}

      <div className="stats-grid">
        <article className="card stat-card">
          <span>Total Invoices</span>
          <h2>{stats.totalInvoices}</h2>
        </article>
        <article className="card stat-card">
          <span>Pending</span>
          <h2>{stats.totalPending}</h2>
        </article>
        <article className="card stat-card">
          <span>Paid</span>
          <h2>{stats.totalPaid}</h2>
        </article>
        <article className="card stat-card">
          <span>Revenue</span>
          <h2>{formatCurrency(stats.totalRevenue)}</h2>
        </article>
      </div>

      <div className="card">
        <div className="table-head">
          <h3>Recent invoices</h3>
          <Link className="ghost" to="/invoices">
            View all
          </Link>
        </div>
        <div className="simple-table">
          {invoices.slice(0, 5).map((invoice) => (
            <Link key={invoice.backendId} to={`/invoices/${invoice.backendId}`} className="row-link">
              <span>#{invoice.invoiceNumber}</span>
              <span>{invoice.clientName}</span>
              <span>{formatDate(invoice.paymentDue)}</span>
              <span>{formatCurrency(getInvoiceTotal(invoice))}</span>
              <StatusPill status={invoice.status} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
