import { Routes, Route } from 'react-router-dom'
import General from './pages/general/general'
import Security from './pages/security/security'
import ProfileTopbar from './sidebar'
import { useLocation } from 'react-router-dom'

function SettingDashboard() {
  const { pathname } = useLocation() // this gets us the current path wich is passed down to sidebar to show us active or non active link

  return (
    <div className='settings__container'>
      <ProfileTopbar path={pathname} />
      <div className='settings__main'>
        <Routes>
          <Route path='/' element={<General />} />
          <Route path='/security' element={<Security />} />
        </Routes>
      </div>
    </div>
  )
}

export default SettingDashboard
