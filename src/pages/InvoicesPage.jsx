import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusPill from '../components/StatusPill';
import { useInvoices } from '../context/InvoiceContext';
import { calcInvoiceTotal, formatCurrency, formatDate } from '../utils/invoice';

export default function InvoicesPage() {
  const { invoices, isLoading, error } = useInvoices();
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return statusFilter === 'all'
      ? invoices
      : invoices.filter((invoice) => invoice.status === statusFilter);
  }, [invoices, statusFilter]);

  return (
    <section className="invoice-page page-enter">
      <div className="invoice-topbar">
        <div>
          <h1>Invoices</h1>
          <p>
            There {filtered.length === 1 ? 'is' : 'are'} {filtered.length} total invoice
            {filtered.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="invoice-top-actions">
          <div className="filter-select-wrap">
            <span className="filter-label">Filter by status</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <Link className="new-invoice-btn" to="/invoices/new">
            <span className="new-invoice-plus">+</span>
            <span>New Invoice</span>
          </Link>
        </div>
      </div>

      <div className="invoice-list">
        {isLoading ? <p className="empty-state">Loading invoices...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {filtered.map((invoice, index) => (
          <Link
            key={invoice.id}
            className="invoice-row"
            to={`/invoices/${invoice.id}`}
            style={{ '--delay-index': index }}
          >
            <strong className="invoice-id">#{invoice.id}</strong>
            <span className="invoice-due">Due {formatDate(invoice.paymentDue)}</span>
            <span className="invoice-client">{invoice.clientName}</span>
            <strong className="invoice-total">{formatCurrency(calcInvoiceTotal(invoice.items))}</strong>
            <StatusPill status={invoice.status} />
            <span className="invoice-chevron" aria-hidden="true">
              ›
            </span>
          </Link>
        ))}
        {!isLoading && filtered.length === 0 ? (
          <p className="empty-state">No invoices match this filter.</p>
        ) : null}
      </div>
    </section>
  );
}
