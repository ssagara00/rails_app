import React from 'react'
import ReactDOM from 'react-dom/client'
import { positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import './index.css'

import { App } from './App'


const options = {
  timeout: 4000,
  position: positions.TOP_LEFT,
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <AlertProvider template={AlertTemplate} {...options}>
    <App />
    </AlertProvider>
  </React.StrictMode>
)
