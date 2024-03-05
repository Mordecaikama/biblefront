import { Link } from 'react-router-dom'

function Account({ state, setState, user, logout, path }) {
  return (
    <div className='account-acc'>
      <div className='acc-container'>
        <i className='fas fa-user'></i>
        {user ? (
          <>
            <span>{user?.name}</span>
            <i className='fas fa-caret-down'></i>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <i className='fas fa-caret-down'></i>
          </>
        )}
      </div>

      <div className='dropdown'>
        {user ? (
          <>
            <a>
              <button className='btn signin' onClick={logout}>
                Log out
              </button>
            </a>

            <Link
              to='/settings'
              className={`${path === '/settings' ? 'active' : null}`}
            >
              <button className='btn signup'>Profile</button>
            </Link>
          </>
        ) : (
          <>
            <Link to='/'>
              <button
                className='btn signin'
                onClick={() => setState({ ...!state, login: !state.login })}
              >
                Sign in
              </button>
            </Link>
            <Link to='/'>
              <button
                className='btn signup'
                onClick={() => setState({ ...!state, signup: !state.signup })}
              >
                Create Account
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Account
