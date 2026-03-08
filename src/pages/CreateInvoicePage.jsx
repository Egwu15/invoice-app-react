import { Link, useNavigate } from 'react-router-dom';
import InvoiceForm from '../components/InvoiceForm';
import { useInvoices } from '../context/InvoiceContext';

export default function CreateInvoicePage() {
  const { createInvoice } = useInvoices();
  const navigate = useNavigate();

  const onCreate = (invoiceData) => {
    const created = createInvoice(invoiceData);
    navigate(`/invoices/${created.id}`);
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
        <InvoiceForm onSubmit={onCreate} submitLabel="Save Invoice" />
      </article>
    </section>
  );
}
