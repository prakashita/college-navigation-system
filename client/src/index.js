import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './utils/fixLeafletIcons'; // Add this line

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);