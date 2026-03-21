import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import InvoiceForm from '../components/InvoiceForm';
import StatusPill from '../components/StatusPill';
import { useInvoices } from '../context/InvoiceContext';
import { calcInvoiceTotal, formatCurrency, formatDate } from '../utils/invoice';

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams();
  const { invoices, deleteInvoice, getInvoiceDetail, markInvoicePaid, updateInvoice } = useInvoices();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const invoice = useMemo(
    () => invoices.find((item) => String(item.backendId) === invoiceId),
    [invoices, invoiceId]
  );

  useEffect(() => {
    const loadDetail = async () => {
      if (!invoice?.backendId) return;

      setIsLoadingDetail(true);
      const result = await getInvoiceDetail(invoice.id);
      if (result.ok) {
        setError('');
      }
      setIsLoadingDetail(false);

      if (!result.ok) {
        setError(result.message);
      }
    };

    loadDetail();
  }, [invoice?.backendId, invoiceId]);

  if (!invoice) {
    return (
      <section className="card">
        <h2>Invoice not found</h2>
        <Link className="ghost" to="/invoices">
          Back to invoices
        </Link>
      </section>
    );
  }

  const onDelete = async () => {
    setError('');
    setIsSubmitting(true);
    const result = await deleteInvoice(invoice.id);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate('/invoices');
  };

  const onUpdate = async (payload) => {
    setError('');
    setIsSubmitting(true);
    const result = await updateInvoice(invoice.id, payload);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setIsEditing(false);
  };

  const onMarkPaid = async () => {
    setError('');
    setIsSubmitting(true);
    const result = await markInvoicePaid(invoice.id);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.message);
    }
  };

  return (
    <section className="invoice-detail-page page-enter">
      <Link className="go-back-link" to="/invoices">
        <span aria-hidden="true">‹</span> Go back
      </Link>

      <div className="detail-status-bar card">
        <div className="detail-status-left">
          <span>Status</span>
          <StatusPill status={invoice.status} />
        </div>
        <div className="detail-actions">
          {invoice.status !== 'paid' ? (
            <button className="ghost" type="button" onClick={onMarkPaid} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Mark as Paid'}
            </button>
          ) : null}
          <button
            className="ghost"
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            disabled={isSubmitting}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button className="danger" type="button" onClick={onDelete} disabled={isSubmitting}>
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      {isLoadingDetail ? <p className="empty-state">Loading invoice details...</p> : null}

      {isEditing ? (
        <div className="card page-enter">
          <h3>Edit invoice #{invoice.invoiceNumber}</h3>
          <InvoiceForm
            initialInvoice={invoice}
            onSubmit={onUpdate}
            submitLabel={isSubmitting ? 'Saving...' : 'Save Changes'}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : null}

      <article className="card invoice-detail-card">
        <header className="invoice-detail-head">
          <div>
            <h2>
              <span>#</span>
              {invoice.invoiceNumber}
            </h2>
            <p>{invoice.description}</p>
          </div>
          <p className="sender-address">{invoice.senderAddress}</p>
        </header>

        <div className="detail-grid">
          <div>
            <h4>Invoice Date</h4>
            <p className="detail-strong">{formatDate(invoice.createdAt)}</p>
            <h4>Payment Due</h4>
            <p className="detail-strong">{formatDate(invoice.paymentDue)}</p>
          </div>
          <div>
            <h4>Bill to</h4>
            <p className="detail-strong">{invoice.clientName}</p>
            <p>{invoice.clientAddress}</p>
          </div>
          <div>
            <h4>Sent to</h4>
            <p className="detail-strong">{invoice.clientEmail}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-headings">
            <span>Item Name</span>
            <span>QTY.</span>
            <span>Price</span>
            <span>Total</span>
          </div>
          {invoice.items.map((item) => (
            <div key={item.id} className="summary-row">
              <strong>{item.name}</strong>
              <span>{item.quantity}</span>
              <span>{formatCurrency(item.price)}</span>
              <strong>{formatCurrency(item.quantity * item.price)}</strong>
            </div>
          ))}
          <div className="summary-total">
            <span>Amount Due</span>
            <strong>{formatCurrency(calcInvoiceTotal(invoice.items))}</strong>
          </div>
        </div>
      </article>
    </section>
  );
}
