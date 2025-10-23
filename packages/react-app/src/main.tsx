import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './contexts/AppContext';
import './styles/index.css';
import { defaultMenus, defaultUser } from './mock/initialState';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider initialMenus={defaultMenus} initialUser={defaultUser} initialBusinessCode={defaultUser.corpCode}>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
