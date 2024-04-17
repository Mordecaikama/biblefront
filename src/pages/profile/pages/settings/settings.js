import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../../../context'
import Notification from '../../../../component/notification/notification'
import { API } from '../../../../config'
import axios from 'axios'

function Settings({ settings }) {
  const { user, setUser } = useContext(Context)
  const [data, setData] = useState(null)
  const [notification, setNotification] = useState(false)

  const handleChange = (name) => {
    const k = Object.keys(name)[0]
    const v = Object.values(name)[0]
    setData({ ...data, [k]: v })
  }

  useEffect(() => {
    getSettings()
  }, [user])

  useEffect(() => {
    const timers = setTimeout(() => setNotification(false), 5000)
    return () => clearTimeout(timers)

    // renders when notification is true
  }, [notification])

  const getSettings = async () => {
    setData(user?.config)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    handleUpdate()
  }

  const handleUpdate = async () => {
    const res = await axios.post(`${API}/update`, {
      _id: user._id,
      config: data,
    })

    if (res.data) {
      setUser(res.data.user)
      setNotification(true)
    }
  }

  return (
    <div className='container page__container settings'>
      <div className='settingitem__container'>
        <p>Font Size</p>
        <div className='fav_color__palette'>
          {settings?.fontSizes?.map((font, ind) => {
            return (
              <div
                className={`font ${
                  data?.fontSize === Object.keys(font)[0] && 'active'
                }`}
                key={ind}
                onClick={() => handleChange({ fontSize: Object.keys(font)[0] })}
              >
                <span>{Object.keys(font)}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className='settingitem__container'>
        <p>Favorite colors</p>
        <div className='fav_color__palette'>
          {settings?.favorites?.map((color, ind) => {
            return (
              <div
                className={`${data?.favColor === color && 'active'}`}
                style={{
                  backgroundColor: `${color ? color : 'white'}`,
                  border: `${!color && '0.25rem solid teal'}`,
                }}
                onClick={() => handleChange({ favColor: color })}
              >
                {data?.favColor === color && 'Active'}
                {!color && 'Unlike'}
              </div>
            )
          })}
        </div>
      </div>

      <div className='settingitem__container'>
        <p>Select Edit notes icon</p>
        <div className='icon__tray'>
          {settings?.notes?.map((icon, ind) => {
            return (
              <>
                <div
                  className={`${data?.editIcon === icon && 'active'}`}
                  onClick={() => handleChange({ editIcon: icon })}
                >
                  <span className='material-symbols-outlined'>{icon}</span>
                </div>
              </>
            )
          })}
        </div>
      </div>

      <div className='settingitem__container'>
        <p>Select color for notes icon</p>
        <div className='fav_color__palette notes__colors'>
          {settings?.favorites.slice(0, 5)?.map((color, ind) => {
            return (
              <div
                className={`${data?.iconColor === color && 'active'}`}
                style={{
                  backgroundColor: `${color ? color : 'red'}`,
                }}
                onClick={() => handleChange({ iconColor: color })}
              >
                {data?.iconColor === color && 'Active'}
              </div>
            )
          })}
        </div>
      </div>
      <button className='btn' onClick={handleSubmit}>
        save
      </button>

      <Notification
        msg='success'
        title='Success'
        subtitle='Successfully updated User Settings'
        toggle={notification}
      />
    </div>
  )
}

export default Settings
