import { useMemo, useState } from 'react';

const EMPTY_ITEM = { id: 'tmp-1', name: '', quantity: 1, price: 100 };

export default function InvoiceForm({ initialInvoice, onSubmit, submitLabel }) {
  const [form, setForm] = useState(
    initialInvoice || {
      clientName: '',
      clientEmail: '',
      description: '',
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 10),
      paymentDue: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
      senderAddress: '19 Union Terrace, Lagos',
      clientAddress: '',
      items: [EMPTY_ITEM],
    }
  );

  const total = useMemo(
    () => form.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.price), 0),
    [form.items]
  );

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateItem = (itemId, key, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, [key]: key === 'name' ? value : Number(value) } : item
      ),
    }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { id: `tmp-${Date.now()}`, name: '', quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (itemId) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.length === 1 ? prev.items : prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      items: form.items.filter((i) => i.name.trim().length > 0),
    });
  };

  return (
    <form className="invoice-form" onSubmit={handleSubmit}>
      <div className="field-grid">
        <label>
          Client Name
          <input
            value={form.clientName}
            onChange={(e) => updateField('clientName', e.target.value)}
            required
          />
        </label>
        <label>
          Client Email
          <input
            type="email"
            value={form.clientEmail}
            onChange={(e) => updateField('clientEmail', e.target.value)}
            required
          />
        </label>
      </div>

      <label>
        Description
        <input
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          required
        />
      </label>

      <div className="field-grid">
        <label>
          Invoice Date
          <input
            type="date"
            value={form.createdAt}
            onChange={(e) => updateField('createdAt', e.target.value)}
            required
          />
        </label>
        <label>
          Payment Due
          <input
            type="date"
            value={form.paymentDue}
            onChange={(e) => updateField('paymentDue', e.target.value)}
            required
          />
        </label>
      </div>

      <div className="field-grid">
        <label>
          Sender Address
          <input
            value={form.senderAddress}
            onChange={(e) => updateField('senderAddress', e.target.value)}
            required
          />
        </label>
        <label>
          Client Address
          <input
            value={form.clientAddress}
            onChange={(e) => updateField('clientAddress', e.target.value)}
            required
          />
        </label>
      </div>

      <label>
        Status
        <select
          value={form.status}
          onChange={(e) => updateField('status', e.target.value)}
          required
        >
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </label>

      <div>
        <h3>Line Items</h3>
        {form.items.map((item) => (
          <div className="item-row" key={item.id}>
            <input
              placeholder="Item"
              value={item.name}
              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Price"
              value={item.price}
              onChange={(e) => updateItem(item.id, 'price', e.target.value)}
              required
            />
            <button type="button" className="ghost danger" onClick={() => removeItem(item.id)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="ghost" onClick={addItem}>
          + Add Item
        </button>
      </div>

      <div className="form-footer">
        <strong>Total: ${total.toLocaleString()}</strong>
        <button className="primary" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
