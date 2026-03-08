import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { InvoiceProvider } from './context/InvoiceContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <InvoiceProvider>
          <App />
        </InvoiceProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
