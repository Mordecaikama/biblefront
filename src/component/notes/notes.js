import React, { useState } from 'react'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function Notes({
  state,
  setState,
  favExist,
  value,
  setValue,
  saveNotes,
  handleBeforeFavorite,
}) {
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ['clean'], // remove formatting button
  ]

  const module = {
    toolbar: toolbarOptions,
  }

  return (
    <div
      className={`info__container notes__container ${state && 'showinfcont'}`}
    >
      <div className='top__media'>
        <span className='material-icons-sharp'>share</span>
        <span>&#124;</span>
        <span
          className='material-icons-sharp'
          onClick={() => setState({ ...state, edit: !state.edit })}
        >
          edit
        </span>{' '}
        |
        {favExist && favExist?.exist ? (
          <span
            style={{ color: `${favExist?.exist}` }}
            className='material-icons-sharp'
            onClick={handleBeforeFavorite}
          >
            favorite
          </span>
        ) : (
          <span
            className='material-symbols-outlined'
            onClick={handleBeforeFavorite}
          >
            favorite
          </span>
        )}{' '}
        |
        <span
          className='material-icons-sharp'
          onClick={() => setState({ ...!state, info: !state.info })}
        >
          close
        </span>
      </div>
      <div className='info__details'>
        <span>share</span>
        <span>&#124;</span>
        <span>Notes</span>

        <span>&#124;</span>
        <span>Like</span>
        <span>&#124;</span>
        <span>close</span>
      </div>
      <div className={`notes__container ${state.edit && 'showedit'}`}>
        <div id='editor'>
          <ReactQuill
            // modules={module}
            theme='snow'
            value={value}
            placeholder={'Compose your notes...'}
            onChange={setValue}
          />
        </div>
        <button className='btn__note btn-variant' onClick={saveNotes}>
          Save
        </button>
      </div>
    </div>
  )
}
