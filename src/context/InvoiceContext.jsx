import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { seedInvoices } from '../data/mockData';
import { authHeader, apiRequest } from '../utils/api';
import { mapApiInvoiceToApp, mapInvoiceFormToApi } from '../utils/mappers';
import { readStorage, writeStorage } from '../utils/storage';
import { AUTH_KEY, INVOICE_KEY } from '../utils/storageKeys';

const InvoiceContext = createContext(null);

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState(() => readStorage(INVOICE_KEY, seedInvoices));

  useEffect(() => writeStorage(INVOICE_KEY, invoices), [invoices]);

  const value = useMemo(
    () => ({
      invoices,
      createInvoice: async (payload) => {
        const session = readStorage(AUTH_KEY, null);

        if (!session?.token) {
          return { ok: false, message: 'You need to sign in before creating invoices.' };
        }

        try {
          const response = await apiRequest('/Invoice', {
            method: 'POST',
            headers: authHeader(session.token),
            body: JSON.stringify(mapInvoiceFormToApi(payload)),
          });

          const invoice = mapApiInvoiceToApp(response, payload);
          setInvoices((prev) => [invoice, ...prev]);
          return { ok: true, invoice };
        } catch (error) {
          return { ok: false, message: error.message || 'Unable to create invoice.' };
        }
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
