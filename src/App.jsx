import { Route, Routes } from 'react-router';
import { HomePage } from './pages/home/HomePage';
import { Playground } from './pages/playground/Playground';
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';

import './App.css';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/playground' element={<Playground />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
    </>
  )
}

export default App