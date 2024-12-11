import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import './index.css'
import { store } from './app/store'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={routes} />
  </Provider>
)

// Use contextBridge
if (window.ipcRenderer) {
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
}
