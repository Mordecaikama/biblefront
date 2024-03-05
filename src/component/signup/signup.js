import React, { useEffect, useState } from 'react'
import { API } from '../../config'
import axios from 'axios'
import Notification from '../notification/notification'

export default function Signup({ state, setState }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    code: '',
    nameError: '',
    codeError: '',
    emailError: '',
    passwordError: '',
    verified: false,
    loading: false,
    redirectToReferer: false,
  })

  const [notification, setNotification] = useState({
    resetemail: false,
  })

  const [status, setStatus] = useState(false)

  const {
    name,
    email,
    password,
    code,
    nameError,
    codeError,
    emailError,
    passwordError,
    verified,
    redirectToReferer,
  } = values

  useEffect(() => {
    const timers = setTimeout(
      () =>
        setNotification({
          resetemail: false,
        }),
      10000
    )
    return () => clearTimeout(timers)
  }, [notification.resetemail]) //query

  const handleChange = (name) => (event) => {
    // validate = (fieldvalue, name)
    setValues({ ...values, [name]: event.target.value })
    // validate(event.target.value, name)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    verified ? handleVerifyEmail() : handleFormSignUp()
  }

  const handleFormSignUp = async () => {
    const res = await axios.post(`${API}/signup`, values)

    if (res.data.error) {
      setValues({
        ...values,
        emailError: res.data.error?.email,
        nameError: res.data.error?.name,
      })
    } else {
      setValues({ ...values, verified: true })
      setNotification({
        ...notification,
        resetemail: !notification.resetemail,
      })

      // setState({ ...!state, login: !state.login })
      // clearForms()
    }
  }

  const handleVerifyEmail = async () => {
    const res = await axios.post(`${API}/confirmemail`, values)

    if (res.data.error) {
      setValues({ ...values, codeError: res.data.error })
    } else {
      setState({ ...!state, login: !state.login })
      clearForms()
    }
  }

  function clearForms() {
    setValues({
      name: '',
      email: '',
      password: '',
      code: '',
      nameError: '',
      emailError: '',
      passwordError: '',
      verified: false,
      loading: false,
      redirectToReferer: false,
    })
  }

  return (
    <div className={`login__container ${state.login && 'showlogin'}`}>
      <Notification
        msg='success'
        title='Success'
        subtitle={`Code sent to your email for Verification`}
        toggle={notification.resetemail}
      />

      <div className='login-forms'>
        <span
          className='material-icons-sharp close'
          onClick={() => setState({ ...!state, signup: !state.signup })}
        >
          close
        </span>
        <h3>{verified ? 'Verify Email' : 'Signup'}</h3>
        <i className='fas fa-user-friends'></i>
        <form>
          {verified ? (
            <>
              <div className='login-password'>
                <input
                  type='text'
                  className='username'
                  value={code}
                  placeholder='code'
                  required
                  onChange={handleChange('code')}
                />
              </div>
              <span className='error'>{codeError}</span>
            </>
          ) : (
            <>
              <div className='login-password'>
                <input
                  type='text'
                  className='username'
                  value={name}
                  placeholder='name'
                  required
                  onChange={handleChange('name')}
                />
              </div>
              <span className='error'>{nameError}</span>
              <div className='login-password'>
                <input
                  type='text'
                  className='username'
                  value={email}
                  placeholder='Email'
                  required
                  onChange={handleChange('email')}
                />
              </div>
              <span className='error'>{emailError}</span>
              <div className='login-password'>
                <input
                  type={status ? 'text' : 'password'}
                  placeholder='password'
                  value={password}
                  required
                  onChange={handleChange('password')}
                />
                {status ? (
                  <i
                    className='fas fa-eye'
                    onClick={() => setStatus(!status)}
                  ></i>
                ) : (
                  <i
                    className='fas fa-eye-slash'
                    onClick={() => setStatus(!status)}
                  ></i>
                )}
              </div>
              <span className='error'>{passwordError}</span>
            </>
          )}

          <div className='signup'>
            Already have an account{' '}
            <button
              style={{
                padding: '0.4rem',
                borderRadius: '0.4rem',
                background: '#dce1eb',
              }}
              onClick={() => setState({ ...!state, login: !state.login })}
            >
              Login
            </button>
          </div>

          <button className=' loginBtn' onClick={handleSubmit}>
            {verified ? 'Verify Email' : 'Signup'}
          </button>
          {/* end of login button */}
        </form>
      </div>
      {/* {JSON.stringify(results)} */}
    </div>
  )
}
