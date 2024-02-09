import React, { useState } from 'react'

export default function Navbar() {
    const [menu, setMenu] = useState("theme")
  return (
    <div className='settings__navbar'>
        <a className={`${menu =='theme' && 'active'}`} onClick={()=>setMenu("theme")}>
        <span>theme</span>
        </a>
        <a className={`${menu =='account' && 'active'}`} onClick={()=>setMenu("account")} > Account</a>
    </div>
  )
}
