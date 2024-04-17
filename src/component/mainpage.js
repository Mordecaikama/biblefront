import React, { useContext, useRef, useState } from 'react'
import { Context } from '../context'
import Toplayer from './toplayer'
import Info from './messages/info'
import Notes from './notes/notes'
import LoginUser from './login/login'
import axios from 'axios'
import { API } from '../config'
import Signup from './signup/signup'
import ResetPassword from './forgotpassword/resetpassword'

function Mainpage({ data, settings, forms, setforms }) {
  const [toplayerState, setToplayerState] = useState({
    favorites: false,
    login: false,
    info: false,
    edit: false,
  })

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    loading: false,
    redirectToReferer: false,
  })

  const [value, setValue] = useState('')

  const intervalRef = useRef(null)

  const { isAuthenticated, user, setUser } = useContext(Context)

  const diskdata = !data ? isAuthenticated() : data
  // const realData = !diskdata ? null : diskdata

  // # favorites
  const [favorites, setFavorites] = useState({})

  const startCounter = (favExist, verseId) => {
    var ti = 100
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => {
      ti += 100
      if (ti >= 300) {
        // checks if user exist after 3 seconds else show login for login
        if (user) {
          setToplayerState({
            ...toplayerState,
            info: !toplayerState.info,
          })
          // checks if verse exists
          favExist && favExist[0] ? setValue(favExist[0]?.notes) : setValue('')
          favExist && favExist[0]
            ? setFavorites({
                id: verseId,
                exist: favExist[0]?.color,
              })
            : setFavorites({ id: verseId })
          clearInterval(intervalRef.current)
          intervalRef.current = null
        } else {
          setforms({
            ...forms,
            login: !forms.login,
          })
        }
      }
    }, ti)
  }

  const stopCounter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleColorClick = async (color) => {
    const touse = { ...favorites, color }
    setToplayerState({ ...!toplayerState, favorites: !toplayerState.favorites })

    const res = await axios.post(`${API}/favorites`, {
      data: touse,
      userId: user?._id,
    })

    if (res?.data) {
      setUser(res.data.data)
    }
  }

  const handleNotesClick = (fav, verseId) => {
    // console.log(fav)
    setValue(fav[0]?.notes)
    setFavorites({ id: verseId })
    setToplayerState({
      ...toplayerState,
      info: !toplayerState.info,
      edit: !toplayerState.edit,
    })
  }

  const checkfavorite = (id) => {
    const res = user && user?.favorites.filter((item) => item.id === id)
    return res
  }

  const saveNotes = async () => {
    const touse = { ...favorites, notes: value }
    console.log(touse)

    setToplayerState({ ...!toplayerState, edit: !toplayerState.edit })

    const res = await axios.post(`${API}/favorites`, {
      data: touse,
      userId: user?._id,
    })

    if (res?.data) {
      setUser(res.data.data)
      setValue('')
    }
  }

  return (
    <div className='mainpage'>
      <div>
        {diskdata &&
          diskdata.map((d, i) => {
            const col = checkfavorite(d?.id)
            console.log(col)
            return (
              <div key={i} className='verse'>
                <span className='v-number'>Verse {d.verseId}: </span>
                <p
                  style={{
                    background: `${
                      col && col[0]?.id === d?.id
                        ? col[0]?.color
                        : 'transparent'
                    }`,
                    color: `${col && col[0]?.color ? 'white' : 'black'}`,
                  }}
                  onMouseDown={() => startCounter(col, d?.id)}
                  onMouseUp={stopCounter}
                  onMouseLeave={stopCounter}
                  onTouchStart={() => startCounter(col, d?.id)}
                  onTouchMove={stopCounter}
                  onTouchEnd={stopCounter}
                >
                  {d.verse}

                  {col &&
                    col[0]?.id === d?.id &&
                    col[0].notes &&
                    col[0]?.notes !== '<p><br></p>' && (
                      <span
                        className='material-icons-sharp edit'
                        style={{ color: `${user?.config?.iconColor}` }}
                        onClick={() => handleNotesClick(col, d?.id)}
                      >
                        {user?.config?.editIcon}
                      </span>
                    )}
                </p>
              </div>
            )
          })}
      </div>

      <Toplayer
        state={toplayerState.favorites}
        children={
          <Info
            state={toplayerState}
            setState={setToplayerState}
            settings={settings}
            user={user}
            handleColorClick={handleColorClick}
          />
        }
      />

      <Toplayer
        state={toplayerState.info}
        children={
          <Notes
            state={toplayerState}
            setState={setToplayerState}
            favExist={favorites}
            value={value}
            setValue={setValue}
            saveNotes={saveNotes}
          />
        }
      />

      <Toplayer
        state={forms.login}
        children={<LoginUser state={forms} setState={setforms} />}
      />
      <Toplayer
        state={forms.signup}
        children={<Signup state={forms} setState={setforms} />}
      />
      <Toplayer
        state={forms.reset}
        children={<ResetPassword state={forms} setState={setforms} />}
      />
    </div>
  )
}

export default Mainpage
