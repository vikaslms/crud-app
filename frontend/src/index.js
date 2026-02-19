import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Load Google Fonts
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700&family=Syne:wght@400;600;700;800&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
