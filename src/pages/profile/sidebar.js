import { Link } from 'react-router-dom'
import { Context } from '../../context'
import { useContext } from 'react'

function ProfileTopbar({ path }) {
  const { user } = useContext(Context)
  return (
    <div className='report__container'>
      <div>
        <Link
          to='/settings'
          className={path === '/settings' && 'active'}
          // onClick={() => setState('report')}
        >
          <span className='material-icons-sharp'>person</span>
          <h3>Profile</h3>
        </Link>
        {user.googleid ? null : (
          <Link
            to='/settings/security'
            className={path === '/settings/security' && 'active'}
            // onClick={() => setState('voters')}
          >
            <span className='material-icons-sharp'>lock</span>
            <h3>Security</h3>
          </Link>
        )}
      </div>
    </div>
  )
}

export default ProfileTopbar
