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
    // starts to count and when its 3 sec or more it shows the dialog
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
    // toggles verse to favorite color
    const touse = { ...favorites, color }

    const res = await axios.post(`${API}/favorites`, {
      data: touse,
      userId: user?._id,
    })

    if (res?.data) {
      setUser(res.data.data)
    }
  }

  const handleUpdate = async (col) => {
    // for updating settings color when color palette is on
    const res = await axios.post(`${API}/update`, {
      _id: user._id,
      config: { ...user?.config, favColor: col },
    })

    if (res.data) {
      setUser(res.data.user)
    }
  }

  const handleColorTemplates = (col) => {
    handleColorClick(col)
    handleUpdate(col)
  }

  const handleNotesClick = (fav, verseId) => {
    // shows notes tab
    setValue(fav[0]?.notes)
    setFavorites({ id: verseId })
    setToplayerState({
      ...toplayerState,
      info: !toplayerState.info,
      edit: !toplayerState.edit,
    })
  }

  const checkfavorite = (id) => {
    //checks if paragraph contains favorite
    const res = user && user?.favorites.filter((item) => item.id === id)
    return res
  }

  const handleBeforeFavorite = () => {
    //checks if colorpalette is true then show it else addfavorite
    if (user?.config?.colorPalette) {
      setToplayerState({
        ...!toplayerState,
        favorites: !toplayerState.favorites,
      })
    } else {
      // get default settings color
      // checks if color exists n if clicked it resets it.
      const mycolor = favorites.exist ? '' : user?.config?.favColor
      handleColorClick(mycolor)
      setToplayerState({ ...toplayerState, info: !toplayerState.info })
    }
  }

  const saveNotes = async () => {
    const touse = { ...favorites, notes: value }

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

  const checkFontSize = () => {
    var filteredArray = settings?.fontSizes.filter(
      (i) => user?.config?.fontSize in i
    )

    return filteredArray
  }
  return (
    <div className='mainpage'>
      <div>
        {diskdata &&
          diskdata.map((d, i) => {
            const col = checkfavorite(d?.id) //checks if exist
            const dt = checkFontSize() // puts the right settings

            return (
              <div key={i} className='verse'>
                <span className='v-number'>Verse {d.verseId}: </span>
                <p
                  className={`${dt && dt[0]}`}
                  style={{
                    background: `${
                      col &&
                      col[0]?.id &&
                      col[0]?.color &&
                      !user?.config?.oneColorForAllFavorites
                        ? col[0]?.color
                        : col &&
                          col[0]?.id &&
                          col[0]?.color?.length > 0 &&
                          user?.config?.oneColorForAllFavorites
                        ? user?.config?.favColor
                        : 'transparent'
                    }`,
                    color: `${col && col[0]?.color ? 'white' : 'black'}`,
                    fontSize: `${
                      dt && dt[0] ? dt[0][user?.config?.fontSize] : null
                    }`,
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
            handleColorClick={handleColorTemplates}
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
            handleBeforeFavorite={handleBeforeFavorite}
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
