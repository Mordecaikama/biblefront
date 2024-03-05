import React, { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'

import AdminDashboard from './admin/adminDashboard'
import SignUpForm from './pages/signup/signup'
import LoginForm from './pages/login/login'
import VotingIndex from './pages/voting/index'
import PreviewLogin from './pages/voting/login/login'
import AdminRoute from './component/auth/adminRoute'
import VoterRegister from './pages/voterregister/register'
import UserRoute from './component/auth/userRoute'
import Ballotreceipt from './pages/receipt'
import ForgottenPassword from './pages/login/forgottenpassword'
import ResetPassword from './pages/login/resetPassword'
import Index from './pages/front/index'
import Testpreviewlogin from './pages/preview/testpreviewlogin'
import TestpreviewMode from './pages/preview/testpreview'
import EmailRoute from './component/auth/emailRoute'
import Confirmemail from './pages/signup/confirm'
import Error from './pages/404'
import SuperAdmin from './super'
// import Header from './admin/pages/header'

function App() {
  const [datas, setDatas] = useState(null)

  return (
    <div className='overall__container'>
      <Routes>
        {/* <Route exact path='/voting/preview' element={<Voting />} /> */}
        <Route path='/' element={<Index />} />
        <Route
          exact
          path='/voting/election/:id/:objectid'
          element={<UserRoute Component={VotingIndex} />}
        />
        <Route
          exact
          path='/preview.election.login/:id'
          element={<Testpreviewlogin />}
        />
        <Route
          exact
          path='/preview.election.mode/:id'
          element={<TestpreviewMode />}
        />
        <Route exact path='/voting/:id' element={<PreviewLogin />} />
        <Route exact path='/login' element={<LoginForm />} />
        <Route exact path='/ballot' element={<Ballotreceipt />} />
        <Route exact path='/signup' element={<SignUpForm />} />
        <Route exact path='/confirm-email/:id' element={<Confirmemail />} />
        <Route exact path='/password-reset' element={<ForgottenPassword />} />
        <Route exact path='/password-reset/:id' element={<ResetPassword />} />
        <Route exact path='/voting/register/:id' element={<VoterRegister />} />
        <Route
          exact
          path='/admindashboard/*'
          element={<AdminRoute Component={AdminDashboard} />}
        />
        <Route
          exact
          path='/admin/*'
          element={<AdminRoute Component={SuperAdmin} />}
        />
        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  )
}

export default App
