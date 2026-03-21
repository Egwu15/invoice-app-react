import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { authHeader, apiRequest } from '../utils/api';
import {
  mapApiInvoiceToApp,
  mapAppStatusToApi,
  mapInvoiceFormToApi,
  mapUpdateInvoiceRequest,
} from '../utils/mappers';

const InvoiceContext = createContext(null);

export function InvoiceProvider({ children }) {
  const { currentUser } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');

  const refreshInvoices = async (statusFilter = activeStatusFilter) => {
    if (!currentUser?.token) {
      setInvoices([]);
      setError('');
      setIsLoading(false);
      setActiveStatusFilter('all');
      return;
    }

    setIsLoading(true);
    setError('');
    setActiveStatusFilter(statusFilter);

    try {
      const response = await apiRequest('/Invoice', {
        headers: authHeader(currentUser.token),
        params: {
          status: statusFilter === 'all' ? undefined : mapAppStatusToApi(statusFilter),
        },
      });

      setInvoices((prev) =>
        response.map((invoice) => {
          const fallbackInvoice = prev.find(
            (item) =>
              item.backendId === Number(invoice.id) ||
              item.invoiceNumber === invoice.invoiceNumber
          );

          return mapApiInvoiceToApp(invoice, fallbackInvoice);
        })
      );
    } catch (loadError) {
      setError(loadError.message || 'Unable to load invoices.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshInvoices('all');
  }, [currentUser?.token]);

  const createInvoice = async (payload) => {
    if (!currentUser?.token) {
      return { ok: false, message: 'You need to sign in before creating invoices.' };
    }

    try {
      const response = await apiRequest('/Invoice', {
        method: 'POST',
        headers: authHeader(currentUser.token),
        body: JSON.stringify(mapInvoiceFormToApi(payload)),
      });

      const invoice = mapApiInvoiceToApp(response, payload);
      setInvoices((prev) => [invoice, ...prev]);
      setError('');
      return { ok: true, invoice };
    } catch (createError) {
      return { ok: false, message: createError.message || 'Unable to create invoice.' };
    }
  };

  const updateInvoice = async (invoiceId, patch) => {
    const existingInvoice = invoices.find((invoice) => String(invoice.backendId) === invoiceId);

    if (!currentUser?.token) {
      return { ok: false, message: 'You need to sign in before updating invoices.' };
    }

    if (!existingInvoice?.backendId) {
      return { ok: false, message: 'This invoice cannot be updated because its backend id is missing.' };
    }

    const nextInvoice = { ...existingInvoice, ...patch };

    try {
      await apiRequest(`/Invoice/${existingInvoice.backendId}`, {
        method: 'PUT',
        headers: authHeader(currentUser.token),
        body: JSON.stringify(mapUpdateInvoiceRequest(nextInvoice)),
      });

      setInvoices((prev) =>
        prev.map((invoice) =>
          String(invoice.backendId) === invoiceId ? nextInvoice : invoice
        )
      );
      setError('');
      return { ok: true, invoice: nextInvoice };
    } catch (updateError) {
      return { ok: false, message: updateError.message || 'Unable to update invoice.' };
    }
  };

  const getInvoiceDetail = async (invoiceId) => {
    const existingInvoice = invoices.find((invoice) => String(invoice.backendId) === invoiceId);

    if (!currentUser?.token) {
      return { ok: false, message: 'You need to sign in before loading invoices.' };
    }

    if (!existingInvoice?.backendId) {
      return { ok: false, message: 'This invoice cannot be loaded because its backend id is missing.' };
    }

    try {
      const response = await apiRequest(`/Invoice/${existingInvoice.backendId}`, {
        headers: authHeader(currentUser.token),
      });

      const invoice = mapApiInvoiceToApp(response, existingInvoice);
      setInvoices((prev) =>
        prev.map((item) => (String(item.backendId) === invoiceId ? invoice : item))
      );
      setError('');
      return { ok: true, invoice };
    } catch (detailError) {
      return { ok: false, message: detailError.message || 'Unable to load invoice details.' };
    }
  };

  const deleteInvoice = async (invoiceId) => {
    const existingInvoice = invoices.find((invoice) => String(invoice.backendId) === invoiceId);

    if (!currentUser?.token) {
      return { ok: false, message: 'You need to sign in before deleting invoices.' };
    }

    if (!existingInvoice?.backendId) {
      return { ok: false, message: 'This invoice cannot be deleted because its backend id is missing.' };
    }

    try {
      await apiRequest(`/Invoice/${existingInvoice.backendId}`, {
        method: 'DELETE',
        headers: authHeader(currentUser.token),
      });

      setInvoices((prev) => prev.filter((invoice) => String(invoice.backendId) !== invoiceId));
      setError('');
      return { ok: true };
    } catch (deleteError) {
      return { ok: false, message: deleteError.message || 'Unable to delete invoice.' };
    }
  };

  const markInvoicePaid = async (invoiceId) => updateInvoice(invoiceId, { status: 'paid' });

  const value = useMemo(
    () => ({
      invoices,
      isLoading,
      error,
      activeStatusFilter,
      refreshInvoices,
      createInvoice,
      getInvoiceDetail,
      updateInvoice,
      deleteInvoice,
      markInvoicePaid,
    }),
    [
      activeStatusFilter,
      createInvoice,
      currentUser?.token,
      deleteInvoice,
      error,
      getInvoiceDetail,
      invoices,
      isLoading,
      markInvoicePaid,
      refreshInvoices,
      updateInvoice,
    ]
  );

  return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>;
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (!context) throw new Error('useInvoices must be used in InvoiceProvider');
  return context;
}
