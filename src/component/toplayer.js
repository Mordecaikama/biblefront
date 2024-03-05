import { useEffect } from 'react'

function Toplayer({ state, children }) {
  useEffect(() => {
    state && (document.body.style.overflowY = 'hidden')

    !state && (document.body.style.overflowY = 'auto')
  }, [state])

  return (
    <div className={`full-img ${state && 'topshow'}`} id='imgBox'>
      {children}

      {JSON.stringify(state)}
    </div>
  )
}

export default Toplayer
