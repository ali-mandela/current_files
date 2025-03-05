import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx';
import './style.css';
import {Toaster} from 'react-hot-toast';
import {BrowserRouter} from 'react-router-dom';
import {StoreProvider} from './context/storeContect.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <App/>
        <Toaster position="bottom-left"/>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>,)
