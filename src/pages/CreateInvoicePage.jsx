import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InvoiceForm from '../components/InvoiceForm';
import { useInvoices } from '../context/InvoiceContext';

export default function CreateInvoicePage() {
  const { createInvoice } = useInvoices();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onCreate = async (invoiceData) => {
    setError('');
    setIsSubmitting(true);
    const result = await createInvoice(invoiceData);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(`/invoices/${result.invoice.id}`);
  };

  return (
    <section className="page-enter">
      <Link className="go-back-link" to="/invoices">
        <span aria-hidden="true">‹</span> Go back
      </Link>

      <article className="card create-invoice-card">
        <div className="section-header">
          <h1>New Invoice</h1>
          <p>Create and send a new invoice.</p>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <InvoiceForm
          onSubmit={onCreate}
          submitLabel={isSubmitting ? 'Saving...' : 'Save Invoice'}
          isSubmitting={isSubmitting}
        />
      </article>
    </section>
  );
}
