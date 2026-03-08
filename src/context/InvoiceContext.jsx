import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { seedInvoices } from '../data/mockData';
import { generateInvoiceId } from '../utils/invoice';
import { readStorage, writeStorage } from '../utils/storage';

const InvoiceContext = createContext(null);
const INVOICE_KEY = 'invoiceflow.invoices';

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState(() => readStorage(INVOICE_KEY, seedInvoices));

  useEffect(() => writeStorage(INVOICE_KEY, invoices), [invoices]);

  const value = useMemo(
    () => ({
      invoices,
      createInvoice: (payload) => {
        const invoice = {
          ...payload,
          id: generateInvoiceId(),
          createdAt: payload.createdAt || new Date().toISOString().slice(0, 10),
        };
        setInvoices((prev) => [invoice, ...prev]);
        return invoice;
      },
      updateInvoice: (invoiceId, patch) => {
        setInvoices((prev) =>
          prev.map((invoice) => (invoice.id === invoiceId ? { ...invoice, ...patch } : invoice))
        );
      },
      deleteInvoice: (invoiceId) => {
        setInvoices((prev) => prev.filter((invoice) => invoice.id !== invoiceId));
      },
      markInvoicePaid: (invoiceId) => {
        setInvoices((prev) =>
          prev.map((invoice) =>
            invoice.id === invoiceId ? { ...invoice, status: 'paid' } : invoice
          )
        );
      },
    }),
    [invoices]
  );

  return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>;
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (!context) throw new Error('useInvoices must be used in InvoiceProvider');
  return context;
}
