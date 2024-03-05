import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import axios from 'axios'
import Dropdown from '../component/dropdown'
import Mainpage from '../component/mainpage'
import { Context } from '../context'
import { useLocation } from 'react-router-dom'
import { API } from '../config'
import Account from '../component/account/account'
import SettingDashboard from './profile/dashboard'
import Notification from '../component/notification/notification'
import AuthRoute from '../component/auth/auth'

function Home() {
  const { pathname } = useLocation() // this gets us the current path wich is passed down to sidebar to show us active or non active link
  const [loading, setLoading] = useState(false)
  const [appdata, setAppdata] = useState(null)
  const [active, setActive] = useState({
    new: false,
    old: false,
    account: false,
    security: false, // for dropdown
    profile: false,
    security: false,
  })
  const [bookChapter, setBookChapter] = useState(null)
  const [book, setBook] = useState(null)
  const [chapter, setChapter] = useState(1)
  const [chapters, setChapters] = useState(null)
  const [translations, setTranslations] = useState(null)
  const [translation, setTranslation] = useState('KJV')
  const { isAuthenticated, AddTolocalStorage, user, setUser } =
    useContext(Context)
  const [menuShow, setMenuShow] = useState(false)
  const [settings, setSettings] = useState(null)
  const [closemenu, setClosemenu] = useState(false)
  const [forms, setForms] = useState({
    login: false,
    signup: false,
    reset: false,
  })

  const [notification, setNotification] = useState(false)

  const [values, setValues] = useState({ email: '', name: '', error: '' })

  const sidebarRef = useRef(null)
  // console.log(user)

  useEffect(() => {
    loadBibleData()
    allTranslations()
    loadFromStorage()
    getUser()
    handleProfile()
  }, [])

  useEffect(() => {
    mouseEnterOut()
  }, [])

  useEffect(() => {
    const timers = setTimeout(() => {
      setNotification(false)
      setValues({ ...values, error: '' })
    }, 5000)
    return () => clearTimeout(timers)

    // renders when notification is true
  }, [notification])

  const handleSidebar = (e) => {
    if (!sidebarRef.current.contains(e.target)) {
      setMenuShow(false)
    }
  }

  const mouseEnterOut = () => {
    document.addEventListener('mousedown', handleSidebar)

    return () => {
      document.removeEventListener('mousedown', handleSidebar)
    }
  }

  // const getUser = () => {
  //   fetch(`${API}/auth/login/success`, {
  //     method: 'GET',
  //     credentials: 'include',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       'Access-Control-Allow-Credentials': true,
  //     },
  //   })
  //     .then((response) => {
  //       if (response.status === 200) return response.json()
  //       throw new Error('authentication has been failed!')
  //     })
  //     .then((resObject) => {
  //       // console.log(resObject.user)
  //       setUser(resObject.user)
  //     })
  //     .catch((err) => {
  //       console.log(err, 'big error here')
  //     })
  // }

  const getUser = async () => {
    const res = await axios.get(`${API}/auth/login/success`)

    if (res.data.error) {
      // console.log(res.data?.error?.email)
      setValues({ ...values, error: res.data?.error?.email })
      setNotification(true)
    } else {
      setUser(res.data.user)
    }
  }

  const handleProfile = async () => {
    const res = await axios.post(`${API}/profile`, {
      email: values.email,
      password: values.password,
    })

    if (res.data) {
      setUser(res.data.user)
    }
  }

  const logout = () => {
    const addr = `${API}/auth/logout`
    window.open(addr, '_self')
  }

  const loadFromStorage = () => {
    const data = isAuthenticated()
    const transl = isAuthenticated('translation')
    const chap = isAuthenticated('chapter')
    const chaps = isAuthenticated('chapters')
    if (data) {
      setChapter(chap)
      setChapters(chaps)
      setBook(data[0])
    }
    if (transl) {
      setTranslation(transl)
    }
  }

  const loadMainpageDefault = (data) => {
    // this loads default mainpage for first time wen no one has used the app
    const diskdata = isAuthenticated()
    !diskdata && handleChapters(data[0])
  }

  const loadBibleData = async () => {
    // this data is loaded into the sidebar

    setLoading(true)
    const res = await axios.get(`${API}/all-books`)
    if (res?.data) {
      setAppdata(res?.data?.data)
      setLoading(false)
      setSettings(res?.data?.settings)
      loadMainpageDefault(res?.data?.data) // this loads default data if app have not been used before
    }
  }

  const handleChapters = async (book) => {
    // this fetches data based on the book e.g Mathew
    // with all chapters and verse

    const { data } = await axios.post(`${API}/book-all-chapters-translations`, {
      bookid: book.id,
      chapterid: 1, // default or localstorage
      abbreviation: translation,
    })
    if (data) {
      setBookChapter(data)
      setChapter(1)
      setBook(data[0])
      allChapters(book)
      AddTolocalStorage('book', data)
      AddTolocalStorage('chapter', 1)
      setMenuShow(!menuShow)
    }
  }

  const handleChapter = (name) => async (event) => {
    // this fetches data when chapterId changes
    setChapter(event.target.value)
    // this sets the chapternumber

    // setLoading(true)
    const { data } = await axios.post(`${API}/all-chapters`, {
      bookid: book.book.id,
      chapterid: event.target.value, // default or localstorage
    })
    if (data) {
      // console.log(data)
      setBookChapter(data)
      AddTolocalStorage('book', data)
      AddTolocalStorage('chapter', event.target.value)
      setBook(data[0])
    }
  }

  const allChapters = async (book) => {
    const { data } = await axios.post(`${API}/book-all-chapters`, {
      bookid: book.id,
    })
    if (data) {
      AddTolocalStorage('chapters', data.length)
      setChapters(data.length)
    }
  }

  const allTranslations = async () => {
    // setLoading(true)
    const { data } = await axios.get(`${API}/all-translations`)
    if (data) {
      setTranslations(data)
    }
  }

  const handleTranslationChange = (name) => async (event) => {
    const val = event.target.value
    setTranslation(val)
    AddTolocalStorage('translation', event.target.value)
    const { data } = await axios.post(`${API}/book-all-chapters-translations`, {
      bookid: book.book.id,
      chapterid: book.chapterId, // default or localstorage
      abbreviation: event.target.value,
    })
    if (data) {
      // console.log(data)
      setBookChapter(data)
      AddTolocalStorage('book', data)
      setBook(data[0])
    }
  }

  return (
    <div className='App'>
      <Notification
        msg='error'
        title='Error'
        subtitle={`${values.error}`}
        toggle={notification}
      />
      <nav>
        <div className='container nav__container'>
          <div className='logo'>
            <img src={require('../assets/img/logo.png')} alt='' />
          </div>

          <div className='middle'>
            <div className='top'>
              {book && (
                <h2 className='btn-variant-text'>
                  {book && book.book && book.book.name}
                </h2>
              )}
              <p>Chapter</p>
              <select value={chapter} onChange={handleChapter('chapter')}>
                <option value={chapter}>{chapter}</option>
                {chapters &&
                  [...Array(chapters).keys()].map((c, i) => {
                    const cut = c + 1
                    return (
                      <option key={i} value={cut}>
                        {cut}
                      </option>
                    )
                  })}
              </select>

              <select
                name='standard-select'
                value={translation && translation}
                onChange={handleTranslationChange('translation')}
              >
                <option value={translations}>{translation}</option>
                {translations &&
                  translations.map((item, ind) => {
                    return (
                      <option value={item.abbreviation}>
                        {item.abbreviation}
                      </option>
                    )
                  })}
              </select>
              {/* <span className='focus'></span> */}
            </div>
          </div>

          <div className='right'>
            {!menuShow && (
              <span
                className='material-icons-sharp'
                onClick={() => setMenuShow(!menuShow)}
              >
                menu
              </span>
            )}
          </div>

          <Account
            state={forms}
            setState={setForms}
            user={user}
            logout={logout}
            path={pathname}
          />
        </div>
      </nav>
      <div className='subnav'>
        <div className='middle'>
          <div className='top'>
            {book && (
              <h2 className='btn btn-variant-text'>
                {book && book.book && book.book.name}
              </h2>
            )}
            <p>Chapter</p>
            <select value={chapter} onChange={handleChapter('chapter')}>
              <option value={chapter}>{chapter}</option>
              {chapters &&
                [...Array(chapters).keys()].map((c, i) => {
                  const cut = c + 1
                  return (
                    <option key={i} value={cut}>
                      {cut}
                    </option>
                  )
                })}
            </select>

            <select
              name='standard-select'
              value={translation && translation}
              onChange={handleTranslationChange('translation')}
            >
              <option value={translations}>{translation}</option>
              {translations &&
                translations.map((item, ind) => {
                  return (
                    <option value={item.abbreviation}>
                      {item.abbreviation}
                    </option>
                  )
                })}
            </select>
          </div>
        </div>
      </div>

      <div className='container main__container'>
        <aside
          className={`sidebar__mobile ${menuShow ? 'menushow' : 'menuclose'}`}
          ref={sidebarRef}
          onClick={handleSidebar}
        >
          <div className='top'>
            <div className='logo_img'>
              <img src={require('../assets/img/logo.png')} alt='' />
            </div>

            <div className='logo'>
              <h4>Holy Bible</h4>
            </div>
            <span
              className='material-icons-sharp close'
              onClick={() => setMenuShow(!menuShow)}
            >
              close
            </span>
          </div>
          <div className='sidebar'>
            <Link
              to='/'
              className={`side-header ${active.old && 'active'}`}
              onClick={() => setActive({ ...active, old: !active.old })}
            >
              <span className='material-icons-sharp'>library_books</span>
              <h3>Old Testament</h3>
              <span className='material-icons-sharp'>keyboard_return</span>
            </Link>
            {active && active.old && (
              <Dropdown
                data={appdata}
                testament='OT'
                handleClick={handleChapters}
              />
            )}
            <a
              className={`side-header ${active.new && 'active'}`}
              onClick={() => {
                setActive({ ...active, new: !active.new })
              }}
            >
              <span className='material-icons-sharp'>library_books</span>
              <h3>New Testament</h3>
              <span className='material-icons-sharp'>keyboard_return</span>
            </a>
            {active && active.new && (
              <Dropdown
                data={appdata}
                testament='NT'
                handleClick={handleChapters}
              />
            )}

            <a
              className={`side-header ${
                active.account && 'active'
              } side__account`}
              onClick={() => setActive({ ...active, account: !active.account })}
            >
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

              <div className='dropdown'>
                {user ? (
                  <>
                    <a>
                      <button className='btn signin' onClick={logout}>
                        Log out
                      </button>
                    </a>

                    <Link to='/settings'>
                      <button className='btn signup'>Profile</button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to='/'>
                      <button
                        className='btn signin'
                        onClick={() => {
                          setForms({ ...values, login: !forms.login })
                          setMenuShow(!menuShow)
                        }}
                      >
                        Sign in
                      </button>
                    </Link>
                    <Link to='/'>
                      <button
                        className='btn signup'
                        onClick={() => {
                          setForms({ ...values, signup: !forms.signup })
                          setMenuShow(!menuShow)
                        }}
                      >
                        Create Account
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </a>
          </div>
          {/* <div className='footer'>
            <span>contact support@biblekama.org</span>
          </div> */}
        </aside>

        <aside>
          <div className='top'>
            <div className='logo'>
              <h4>Holy Bible</h4>
            </div>
          </div>
          <div className='sidebar'>
            <Link
              to='/'
              className={`side-header ${active.old && 'active'}`}
              onClick={() => setActive({ ...active, old: !active.old })}
            >
              <span className='material-icons-sharp'>library_books</span>
              <h3>Old Testament</h3>
              <span className='material-icons-sharp'>keyboard_return</span>
            </Link>
            {active && active.old && (
              <Dropdown
                data={appdata}
                testament='OT'
                handleClick={handleChapters}
              />
            )}
            <Link
              to='/'
              className={`side-header ${active.new && 'active'}`}
              onClick={() => {
                setActive({ ...active, new: !active.new })
              }}
            >
              <span className='material-icons-sharp'>library_books</span>
              <h3>New Testament</h3>
              <span className='material-icons-sharp'>keyboard_return</span>
            </Link>
            {active && active.new && (
              <Dropdown
                data={appdata}
                testament='NT'
                handleClick={handleChapters}
              />
            )}
          </div>

          {/* <div className='footer'>
            <span>contact support@biblekama.org</span>
          </div> */}
        </aside>

        <main>
          <Routes>
            <Route
              exact
              path='/'
              element={
                <Mainpage
                  data={bookChapter}
                  settings={settings}
                  forms={forms}
                  setforms={setForms}
                />
              }
            />
            {user && (
              <Route
                exact
                path='/settings/*'
                element={
                  <SettingDashboard settings={settings} />
                  // <AuthRoute Component={SettingDashboard} settings={settings} />
                }
              />
            )}
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default Home
