import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Store, { persistor } from './redux/Store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Provider store={Store}>
     <PersistGate loading={null} persistor={persistor}>
     <ToastContainer />
     <Router>
              <App />
            </Router>
     </PersistGate>

     </Provider>
   
  </StrictMode>,
)