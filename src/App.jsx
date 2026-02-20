import { Route, Routes } from 'react-router';
import { HomePage } from './pages/home/HomePage';
import { Playground } from './pages/playground/Playground';
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';
import { Missing } from './components/Missing';
import { ProjectsHome } from './pages/project/ProjectsHome';
import { OAuthConsent } from './pages/auth/OAuthConsent';
import { RequiredAuth } from './components/RequiredAuth';
import { RequiredOAuth } from './components/RequiredOAuth';

// import { Test } from './Test';

import './App.css';
import { OAuhtSuccess } from './pages/auth/OAuhtSuccess';

function App() {

  return (
    <Routes>
      {/* public routes */}
      <Route index path='/' element={<HomePage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/auth-success' element={<OAuhtSuccess />} />

      {/*
        TODO: the user is being thrown back to home page
        after login, while hitting projects button
        instead the user should have gone to disclaimer page
      */}
      <Route element={<RequiredAuth />}>
        <Route element={<RequiredOAuth />} >
          <Route path="/projects">
            <Route index element={<ProjectsHome />} />
            <Route path=':pid/playground' element={<Playground />} />
          </Route>
        </Route>

          <Route path='/disclaimer' element={<OAuthConsent />} />
      </Route>

      {/* <Route path="/test" element={<Test />} /> */}

      {/* catch any other routes */}
      <Route path='*' element={<Missing />} />
    </Routes>
  )
}

export default App