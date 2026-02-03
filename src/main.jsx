import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Watermark: https://divyansh.codes/ - Assignment Protection
// Hidden watermark: divyansh.codes

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Console watermark (hidden from users)
if (typeof window !== 'undefined') {
  console.log('%cAssignment Protected by https://divyansh.codes/', 'color: transparent; font-size: 0px;');
}


