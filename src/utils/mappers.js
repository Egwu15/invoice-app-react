export function getAvatarInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function mapAuthResponseToUser(authResponse) {
  return {
    id: String(authResponse.id),
    fullName: authResponse.userName,
    email: authResponse.email,
    token: authResponse.token,
    company: 'New Company',
    role: 'Owner',
    location: 'Remote',
    avatarInitials: getAvatarInitials(authResponse.userName),
  };
}

export function mapInvoiceFormToApi(payload) {
  return {
    clientName: payload.clientName,
    clientEmail: payload.clientEmail,
    description: payload.description || null,
    billTo: payload.clientAddress,
    sendTo: payload.clientEmail,
    senderAddress: payload.senderAddress || null,
    status: mapAppStatusToApi(payload.status),
    dueDate: payload.paymentDue ? `${payload.paymentDue}T00:00:00` : null,
    items: payload.items.map((item) => ({
      name: item.name,
      amount: Number(item.price),
      quantity: Number(item.quantity),
    })),
  };
}

export function mapApiInvoiceToApp(invoiceResponse, fallbackPayload) {
  const backendId = Number(invoiceResponse.id) || fallbackPayload?.backendId || null;

  return {
    id: backendId ? String(backendId) : fallbackPayload?.id || '',
    backendId,
    invoiceNumber:
      invoiceResponse.invoiceNumber || fallbackPayload?.invoiceNumber || String(invoiceResponse.id),
    clientName: invoiceResponse.clientName,
    clientEmail: invoiceResponse.clientEmail,
    description: invoiceResponse.description || fallbackPayload?.description || '',
    status: mapInvoiceStatus(invoiceResponse.status, fallbackPayload?.status),
    total:
      Number(invoiceResponse.totalAmount ?? invoiceResponse.total) ||
      fallbackPayload?.total ||
      (Array.isArray(invoiceResponse.items)
        ? invoiceResponse.items.reduce(
            (sum, item) => sum + Number(item.amount) * Number(item.quantity),
            0
          )
        : 0),
    createdAt: formatDateOnly(invoiceResponse.createdAt) || fallbackPayload?.createdAt || '',
    paymentDue: formatDateOnly(invoiceResponse.dueDate) || fallbackPayload?.paymentDue || '',
    senderAddress: invoiceResponse.senderAddress || fallbackPayload?.senderAddress || '',
    clientAddress: invoiceResponse.billTo || fallbackPayload?.clientAddress || '',
    items: Array.isArray(invoiceResponse.items)
      ? invoiceResponse.items.map((item, index) => ({
          id: item.id || `${invoiceResponse.id || invoiceResponse.invoiceNumber}-${index + 1}`,
          name: item.name,
          quantity: Number(item.quantity) || 1,
          price: Number(item.amount) || 0,
        }))
      : fallbackPayload?.items || [],
  };
}

function mapInvoiceStatus(status, fallbackStatus) {
  if (typeof status === 'string') return status.toLowerCase();

  switch (status) {
    case 0:
      return 'draft';
    case 1:
      return 'pending';
    case 2:
      return 'paid';
    default:
      return fallbackStatus || 'draft';
  }
}

export function mapAppStatusToApi(status) {
  switch (status) {
    case 'draft':
      return 0;
    case 'pending':
      return 1;
    case 'paid':
      return 2;
    default:
      return undefined;
  }
}

function formatDateOnly(value) {
  if (!value) return '';

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}
