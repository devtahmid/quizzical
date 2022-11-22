import React from 'react'
import './Modal.css'
import { decode } from 'html-entities'

export default function Modal(props) {
  return (
    <div id="modal-container" onClick={(event) => props.closeModal(event)}>
      <div id="modal" onClick={(e) => e.stopPropagation()}>

        <div id="close-btn" onClick={(e) => props.closeModal(e)}>{decode("&times")}</div>
        <br />
        <p>Please answer all the questions</p>
      </div>
    </div>
  )
}