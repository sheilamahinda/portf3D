import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the 'client' version for React 18
import './index.css';
import AppRouter from './AppRouter';

// Create root element using React 18's createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
