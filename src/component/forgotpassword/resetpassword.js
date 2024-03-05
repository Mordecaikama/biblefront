import React, { useEffect, useState } from 'react'
import { API } from '../../config'
import axios from 'axios'
import Notification from '../notification/notification'

export default function ResetPassword({ state, setState }) {
  const [values, setValues] = useState({
    email: '',
    password: '',
    code: '',
    codeError: '',
    passwordError: '',
    emailError: '',
    verified: false,
    message: false,
  })

  const [status, setStatus] = useState(false)

  const [notification, setNotification] = useState({
    resetemail: false,
  })

  const {
    email,
    password,
    passwordError,
    emailError,
    code,
    codeError,
    message,
    verified,
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
    if (verified) {
      handleResetPassword()
    } else {
      !message ? handleForgotPassword() : handleVerifyCode()
    }
  }

  const handleForgotPassword = async () => {
    const res = await axios.post(`${API}/forgotpassword`, {
      email: values.email,
      password: values.password,
    })

    if (res.data?.errors) {
      setValues({
        ...values,
        emailError: res.data?.errors,
      })
    } else {
      setValues({ ...values, message: res.data?.msg })
      setNotification({
        ...notification,
        resetemail: !notification.resetemail,
      })
      // clearForms()
    }
  }
  const handleVerifyCode = async () => {
    const res = await axios.post(`${API}/verifycode`, {
      email: values.email,
      code: values.code,
    })

    if (res.data?.error) {
      setValues({
        ...values,
        codeError: res.data?.error,
      })
    } else {
      setValues({ ...values, verified: true })
    }
  }
  const handleResetPassword = async () => {
    const res = await axios.post(`${API}/resetpassword`, {
      email,
      password,
    })

    if (res.data?.error) {
      setValues({
        ...values,
        passwordError: res.data?.error,
      })
    } else {
      setState({ ...!state, login: !state.login })
      clearForms()
    }
  }

  function clearForms() {
    setValues({
      email: '',
      password: '',
      code: '',
      codeError: '',
      passwordError: '',
      emailError: '',
      verified: false,
      message: false,
    })
  }

  return (
    <div className={`login__container ${state.login && 'showlogin'}`}>
      <Notification
        msg='success'
        title='Success'
        subtitle={`Code sent to your email`}
        toggle={notification.resetemail}
      />

      <div className='login-forms'>
        <span
          className='material-icons-sharp close'
          onClick={() => setState({ ...state, reset: !state.reset })}
        >
          close
        </span>
        <h3>
          {verified
            ? 'Reset Password'
            : !message
            ? 'Forgot Password'
            : 'Verify Code'}
        </h3>
        <i className='fas fa-user-friends'></i>
        <form>
          {/* {message && (
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
          )} */}
          {}

          {verified ? (
            <>
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
          ) : message ? (
            <>
              <div className='login-password'>
                <input
                  type='text'
                  placeholder='Code'
                  value={code}
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
                  value={email}
                  placeholder='Email'
                  required
                  onChange={handleChange('email')}
                />
              </div>
              <span className='error'>{emailError}</span>
            </>
          )}

          <button className=' loginBtn' onClick={handleSubmit}>
            {verified
              ? 'Reset Password'
              : !message
              ? 'Forgot Password'
              : 'Verify Code'}
          </button>
          {/* end of login button */}

          {/* {JSON.stringify(values)} */}
          {/* forgotten password change password. */}
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
        </form>
      </div>
    </div>
  )
}
