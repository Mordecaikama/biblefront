import React, { useContext, useState } from 'react'
import axios from 'axios'
// import { Context } from '../../../../../Context'
import Notification from '../../../../component/notification/notification'
import { Context } from '../../../../context'
import { API } from '../../../../config'

function Security() {
  const { user } = useContext(Context)
  const [values, setValues] = useState({
    old: '',
    newpass: '',
    confirm: '',
    oldError: '',
    email: '',
    newError: '',
  })

  const [status, setStatus] = useState({
    old: false,
    news: false,
    confirm: false,
  })

  const [notification, setNotification] = useState({
    success: false,
    error: false,
  })

  const { old, newpass, confirm, newError } = values

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newpass === confirm) {
      // check the old password with the system
      checkOldpassword()
    } else {
      setValues({ ...values, newError: 'passwords do not match' })
      setNotification({ ...notification, error: !notification.error })
    }
  }

  const checkOldpassword = async () => {
    const res = await axios.post(`${API}/changepassword`, {
      password: values.old,
      email: user?.email,
      id: user?._id,
      newpass,
    })

    if (res.data.errors) {
      setValues({ ...values, newError: 'Current password is Incorrect' })
      setNotification({ ...notification, error: !notification.error })
    } else {
      setNotification({ ...notification, success: !notification.success })
      clear()
    }
  }

  const clear = () => {
    setValues({
      old: '',
      newpass: '',
      confirm: '',
      oldError: '',
      email: '',
      newError: '',
    })
  }
  return (
    <div className='container page__container'>
      <div className='profile-forms settings__form security'>
        <div className='title'>
          <h2>Security</h2>
          {/* <span>{newError}</span> */}
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor='title'>Current Password</label>
          <div className='login-password'>
            <input
              type={status.old ? 'text' : 'password'}
              className='username'
              value={old}
              placeholder='Current password'
              required
              onChange={handleChange('old')}
              onFocus={() => clear()}
            />
            {status.old ? (
              <i
                className='fas fa-eye'
                onClick={() => setStatus({ ...status, old: !status.old })}
              ></i>
            ) : (
              <i
                className='fas fa-eye-slash'
                onClick={() => setStatus({ ...status, old: !status.old })}
              ></i>
            )}
          </div>
          <label htmlFor='title'>New Password</label>
          <div className='login-password'>
            <input
              type={status.news ? 'text' : 'password'}
              className='username'
              value={newpass}
              placeholder='New passowrd'
              required
              onChange={handleChange('newpass')}
            />
            {status.news ? (
              <i
                className='fas fa-eye'
                onClick={() => setStatus({ ...status, news: !status.news })}
              ></i>
            ) : (
              <i
                className='fas fa-eye-slash'
                onClick={() => setStatus({ ...status, news: !status.news })}
              ></i>
            )}
          </div>
          <label htmlFor='title'>Confirm Password</label>
          <div className='login-password'>
            <input
              type={status.confirm ? 'text' : 'password'}
              className='username'
              value={confirm}
              placeholder='Confirm password'
              required
              onChange={handleChange('confirm')}
            />
            {status.confirm ? (
              <i
                className='fas fa-eye'
                onClick={() =>
                  setStatus({ ...status, confirm: !status.confirm })
                }
              ></i>
            ) : (
              <i
                className='fas fa-eye-slash'
                onClick={() =>
                  setStatus({ ...status, confirm: !status.confirm })
                }
              ></i>
            )}
          </div>

          <button className=' loginBtn'>Save</button>
        </form>
      </div>
      {/* {JSON.stringify(values)} */}
      <Notification
        msg='error'
        title='Error'
        subtitle={newError}
        toggle={notification.error}
      />
      <Notification
        msg='success'
        title='Success'
        subtitle='Passwords updated successfully'
        toggle={notification.success}
      />
    </div>
  )
}

export default Security
