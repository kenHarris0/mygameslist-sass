import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Context from './Context/Context.jsx'
import { BrowserRouter } from 'react-router-dom'
import { partystore } from './Redux/Store/partystore.js'
import {Provider} from 'react-redux'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={partystore}>
  <Context>
    <App />
  </Context>
  </Provider>
  </BrowserRouter>
)
