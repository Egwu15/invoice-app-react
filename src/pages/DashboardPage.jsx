import { Link } from 'react-router-dom';
import StatusPill from '../components/StatusPill';
import { useInvoices } from '../context/InvoiceContext';
import { calcInvoiceTotal, formatCurrency, formatDate } from '../utils/invoice';

export default function DashboardPage() {
  const { invoices } = useInvoices();
  const paid = invoices.filter((inv) => inv.status === 'paid').length;
  const pending = invoices.filter((inv) => inv.status === 'pending').length;
  const totalRevenue = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, invoice) => sum + calcInvoiceTotal(invoice.items), 0);

  return (
    <section>
      <div className="section-header">
        <h1>Dashboard</h1>
        <p>Snapshot of invoice performance and payment health.</p>
      </div>

      <div className="stats-grid">
        <article className="card stat-card">
          <span>Total Invoices</span>
          <h2>{invoices.length}</h2>
        </article>
        <article className="card stat-card">
          <span>Pending</span>
          <h2>{pending}</h2>
        </article>
        <article className="card stat-card">
          <span>Paid</span>
          <h2>{paid}</h2>
        </article>
        <article className="card stat-card">
          <span>Revenue</span>
          <h2>{formatCurrency(totalRevenue)}</h2>
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
            <Link key={invoice.id} to={`/invoices/${invoice.id}`} className="row-link">
              <span>#{invoice.id}</span>
              <span>{invoice.clientName}</span>
              <span>{formatDate(invoice.paymentDue)}</span>
              <span>{formatCurrency(calcInvoiceTotal(invoice.items))}</span>
              <StatusPill status={invoice.status} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
