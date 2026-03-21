import { Link } from 'react-router-dom';
import StatusPill from '../components/StatusPill';
import { useInvoices } from '../context/InvoiceContext';
import { formatCurrency, formatDate, getInvoiceTotal } from '../utils/invoice';

export default function InvoicesPage() {
  const { invoices, isLoading, error, activeStatusFilter, refreshInvoices } = useInvoices();

  return (
    <section className="invoice-page page-enter">
      <div className="invoice-topbar">
        <div>
          <h1>Invoices</h1>
          <p>
            There {invoices.length === 1 ? 'is' : 'are'} {invoices.length} total invoice
            {invoices.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="invoice-top-actions">
          <div className="filter-select-wrap">
            <span className="filter-label">Filter by status</span>
            <select
              value={activeStatusFilter}
              onChange={(e) => refreshInvoices(e.target.value)}
            >
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
        {invoices.map((invoice, index) => (
          <Link
            key={invoice.backendId}
            className="invoice-row"
            to={`/invoices/${invoice.backendId}`}
            style={{ '--delay-index': index }}
          >
            <strong className="invoice-id">#{invoice.invoiceNumber}</strong>
            <span className="invoice-due">Due {formatDate(invoice.paymentDue)}</span>
            <span className="invoice-client">{invoice.clientName}</span>
            <strong className="invoice-total">{formatCurrency(getInvoiceTotal(invoice))}</strong>
            <StatusPill status={invoice.status} />
            <span className="invoice-chevron" aria-hidden="true">
              ›
            </span>
          </Link>
        ))}
        {!isLoading && invoices.length === 0 ? (
          <p className="empty-state">No invoices match this filter.</p>
        ) : null}
      </div>
    </section>
  );
}
