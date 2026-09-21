import React from 'react'
import ReactDOM from 'react-dom/client'
import MobileApp from './MobileApp'
import '../../app/globals.css'
import './mobile.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MobileApp />
  </React.StrictMode>,
)
