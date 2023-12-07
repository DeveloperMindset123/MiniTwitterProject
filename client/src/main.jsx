import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ThemeContextWrapper from './components/ThemeContextWrapper.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeContextWrapper> {/**Added the ThemeContextWrapper component wrapper here which will allow us to switch between light and dark mode */}
    <React.StrictMode>
      <App />
    </React.StrictMode>{' '}
  </ThemeContextWrapper>
)
