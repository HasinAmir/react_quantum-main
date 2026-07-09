import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/forum.css';

const root = createRoot(document.getElementById('forum-root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
