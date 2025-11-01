import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './index.css'
import RoutingApp from './components/RoutingApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RoutingApp />
    </Provider>
  </StrictMode>,
)
