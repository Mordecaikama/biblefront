import React from 'react'

function Notification({
  msg = 'success',
  title = 'title',
  subtitle = 'title',
  toggle = false,
}) {
  return (
    <>
      {toggle && (
        <div
          id='notification'
          className={
            (msg === 'success' && 'notify__success') ||
            (msg === 'error' && 'notify__error')
          }
        >
          <div className='notify__title'>
            {(msg === 'success' && <i className='fas fa-check-circle'></i>) ||
              (msg === 'error' && (
                <i className='far fa-exclamation-circle'></i>
              ))}
            {title}
          </div>
          <div className='notify__subtitle'>{subtitle}</div>
        </div>
      )}
    </>
  )
}

export default Notification
