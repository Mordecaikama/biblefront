import { Navigate, useLocation } from 'react-router-dom'

const AuthRoute = ({ Component, settings, user }) => {
  // const { user } = useContext(Context)
  // const [auth, setAuth] = useState(user)

  const location = useLocation()

  return user && <Component settings={settings} />
}

export default AuthRoute
