import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={routes} />
)

// Use contextBridge
if (window.ipcRenderer) {
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
}
