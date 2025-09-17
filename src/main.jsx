import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./i18n";
import { AuthProvider } from './Context/authProvider.jsx';
import { OptionsProvider } from "./Context/optionsContext.jsx";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <OptionsProvider>
      <App />
      </OptionsProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
