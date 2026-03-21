export function generateInvoiceId() {
  const letters = Array.from({ length: 2 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}${numbers}`;
}

export function calcInvoiceTotal(items) {
  return items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.price), 0);
}

export function getInvoiceTotal(invoice) {
  if (typeof invoice?.total === 'number' && !Number.isNaN(invoice.total)) {
    return invoice.total;
  }

  return calcInvoiceTotal(invoice?.items || []);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateInput) {
  if (!dateInput) return 'N/A';

  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
