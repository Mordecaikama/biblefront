import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../../../context'
import axios from 'axios'
import Notification from '../../../../component/notification/notification'
import { API } from '../../../../config'

function General() {
  const { user, setUser } = useContext(Context)
  const [values, setValues] = useState({
    name: '',
    email: '',
    error: '',
  })
  const [notification, setNotification] = useState(false)

  useEffect(() => {
    const timers = setTimeout(() => setNotification(false), 5000)
    return () => clearTimeout(timers)

    // renders when notification is true
  }, [notification])

  useEffect(() => {
    user && setValues({ ...values, name: user?.name, email: user?.email })
  }, [user])

  const { name, email, error } = values

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    handleUpdate()
  }

  const handleUpdate = async () => {
    const res = await axios.post(`${API}/update`, {
      _id: user._id,
      name,
      email,
    })

    if (res.data) {
      setUser(res.data.user)
      setNotification(true)
    } else {
      setValues({ ...values, error: res.data?.error })
    }
  }
  return (
    // this css combines login-forms from signup css
    // settings__form from app.css
    <div className='container page__container'>
      <div className='profile-forms settings__form'>
        <div className='title'>
          {/* <span></span> */}
          <h2>Profile Settings</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor='title'>Name</label>
          <div className='login-password'>
            <input
              type='text'
              className='username'
              value={name}
              placeholder='Name'
              required
              onChange={handleChange('name')}
            />
          </div>
          <label htmlFor='title'>Email</label>
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

          <button className=' loginBtn'>Update</button>
        </form>
      </div>

      <Notification
        msg='success'
        title='Success'
        subtitle='Successfully updated User Profile'
        toggle={notification}
      />
    </div>
  )
}

export default General
