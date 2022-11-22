import React from 'react'
import './BeginScreen.css';

export default function BeginScreen(props) {
  return (
    <div className='begin-screen'>
      <h1>Quizzical</h1>
      <p className='begin-screen-description'>{/* Some description if needed */}</p>
      <div className='margin-top-big'>
        <button className='action-button' onClick={props.startGame}>Start quiz</button>
      </div>
    </div>
  )
}