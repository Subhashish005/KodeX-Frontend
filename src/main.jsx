import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthProvider.jsx'
import { Slide, ToastContainer } from 'react-toastify'

// TODO: custom styli-fy it, yeah made a new word problem?
import 'react-toastify/dist/ReactToastify.css';
import './index.css';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <ToastContainer
        transition={Slide}
        newestOnTop={true}
      />
    </AuthProvider>
  </BrowserRouter>,
)
