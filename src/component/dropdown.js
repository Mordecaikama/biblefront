import React, { useState } from 'react'
import axios from 'axios'

function Dropdown({ data, testament, handleClick }) {
  const [datas, setData] = useState([
    { name: 'Genesis', testament: 'OT' },
    { name: 'Exodus', testament: 'OT' },
    { name: 'Numbers', testament: 'OT' },
    { name: 'Mathew', testament: 'NT' },
    { name: 'Mark', testament: 'NT' },
    { name: 'Luke', testament: 'NT' },
  ])

  return (
    <div className='dropdown'>
      {data &&
        data.map((d, i) => {
          if (d.testament === testament) {
            return (
              <a href='#' className='' key={i} onClick={() => handleClick(d)}>
                <span className='material-icons-sharp'>
                  format_list_bulleted
                </span>
                <h3>{d.name}</h3>
              </a>
            )
          }
        })}
    </div>
  )
}

export default Dropdown
