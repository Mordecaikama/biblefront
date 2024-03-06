import React, { useContext, useState } from 'react'
import { API } from '../../config'
import axios from 'axios'
import './login.css'
import { Context } from '../../context'

export default function LoginUser({ state, setState }) {
  const [values, setValues] = useState({
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    loading: false,
    redirectToReferer: false,
  })

  const { setUser, user } = useContext(Context)

  const { email, password, emailError, passwordError, redirectToReferer } =
    values

  const handleChange = (name) => (event) => {
    // validate = (fieldvalue, name)
    setValues({ ...values, [name]: event.target.value })
    // validate(event.target.value, name)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleFormLogin()
  }

  const handleFormLogin = async () => {
    const res = await axios.post(`${API}/login`, {
      email: values.email,
      password: values.password,
    })

    if (res.data?.errors) {
      // console.log(res.data)
      setValues({
        ...values,
        passwordError: res.data?.errors.password,
        emailError: res.data?.errors.email,
      })
    } else {
      setUser(res.data.user)
      setState({ ...state, login: !state.login })
      clearForms()
    }
  }

  const handleGoogleClick = async () => {
    const addr = `${API}/auth/google`
    window.open(addr, '_self')
  }
  const handleGitClick = async () => {
    const addr = `${API}/auth/github`
    window.open(addr, '_self')
  }

  function clearForms() {
    setValues({
      ...values,
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
    })
  }

  return (
    <div className={`login__container ${state.login && 'showlogin'}`}>
      <div className='login-forms'>
        <span
          className='material-icons-sharp close'
          onClick={() => setState({ ...state, login: !state.login })}
        >
          close
        </span>
        <h3>Login</h3>
        <i className='fas fa-user-friends'></i>
        <form>
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
              type='password'
              placeholder='password'
              value={password}
              required
              onChange={handleChange('password')}
            />
          </div>
          <span className='error'>{passwordError}</span>

          <span
            className='fg-password'
            onClick={() => setState({ ...!state, reset: !state.reset })}
          >
            forgotten password
          </span>

          <button className=' loginBtn' onClick={handleSubmit}>
            Login
          </button>
          {/* end of login button */}

          {/* forgotten password change password. */}

          <div className='signup'>
            Dont have an account{' '}
            <button
              style={{
                padding: '0.4rem',
                borderRadius: '0.4rem',
                background: '#dce1eb',
              }}
              onClick={() => setState({ ...!state, signup: !state.signup })}
            >
              Sign Up
            </button>
          </div>
        </form>

        <button className='social__btn' onClick={handleGoogleClick}>
          <i className='fa-brands fa-google'></i>
          <span>Google</span>
        </button>
        {/* <button className='social__btn'>
          <i className='fa-brands fa-facebook'></i>
          <span>Facebook</span>
        </button> */}
        <button className='social__btn' onClick={handleGitClick}>
          {/* <i className='fa-brands fa-linkedin-in'></i> */}
          <img src={require('../../assets/img/git.png')} alt='' />
          <span>GitHub</span>
        </button>
      </div>
    </div>
  )
}
