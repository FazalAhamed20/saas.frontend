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
import { ThemeProvider } from './context/ThemeContext.tsx';
import '@fontsource/roboto'; // Import the font

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
     <Provider store={Store}>
     <PersistGate loading={null} persistor={persistor}>
     <ToastContainer />
     <Router>
              <App />
            </Router>
     </PersistGate>

     </Provider>
     </ThemeProvider>
   
  </StrictMode>,
)