function Info({ state, setState, settings, handleColorClick, user }) {
  return (
    <div className={`info__container ${state && 'showinfcont'}`}>
      <div className='top'>
        <span
          className='material-icons-sharp'
          onClick={() => setState({ ...state, favorites: !state.favorites })}
        >
          close
        </span>
      </div>
      <div className='default'>
        <div
          style={{ backgroundColor: `${user && user?.color}` }}
          onClick={() => handleColorClick(user && user?.color)}
        >
          <span>Default</span>
        </div>
      </div>
      <div className='favorite'>
        {settings?.favorites.map((color, ind) => {
          return (
            <div
              style={{
                backgroundColor: `${color ? color : 'white'}`,
              }}
              onClick={() => handleColorClick(color)}
            >
              {!color && 'Unlike'}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Info
