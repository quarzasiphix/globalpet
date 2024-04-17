import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouteProvider } from './components/map/RouteContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouteProvider>
      <App />
    </RouteProvider>
  </React.StrictMode>,
)
