import React, { useContext } from 'react'
import { Context } from '../context'

function Mainpage({ data }) {
  // console.log(!data ? 'data to come' : data)

  const { isAuthenticated } = useContext(Context)

  const diskdata = !data ? isAuthenticated() : data
  const realData = !diskdata ? null : diskdata

  return (
    <div className='mainpage'>
      <div>
        {diskdata &&
          diskdata.map((d, i) => {
            return (
              <div key={i} className='verse'>
                <span className='v-number'>Verse {d.verseId}: </span>
                <p>{d.verse}</p>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Mainpage
