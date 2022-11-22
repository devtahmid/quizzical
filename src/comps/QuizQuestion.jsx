import React from 'react'
import './QuizQuestion.css'
import { decode } from 'html-entities'

export default function QuizQuestion(props) {

  const optionElements = props.options.map((option, index) => {
    let optionStyleClass;

    if (props.resultOut == false) {
      if (option === props.selected_option)
        optionStyleClass = "selected";
    }
    else { //resultOut==true
      if (option === props.correct_option)
        optionStyleClass = "correct"
      else if (option === props.selected_option && props.selected_option !== props.correct_option)
        optionStyleClass = "wrong"
      else
        optionStyleClass = "unselected-option"
    }

    return (
      <div key={index} >
        <label htmlFor={`${props.name}-${index}`} className={`option-button `}>
          <div className={`label-innerdiv ${optionStyleClass} `}>
            <input className='option-button-radio' type="radio"
              name={props.name} value={option}
              id={`${props.name}-${index}`}
              onChange={(event) => props.handleOptionClick(event)}
              checked={option === props.selected_option}
            />
            <div className={`option-button-text`}>{decode(option)}</div>
          </div>
        </label>

      </div>
    )
  })

  return (
    <div className='quiz-component margin-top'>
      <div className='option-question'>{decode(props.question)}</div>
      <div className='options margin-top'>
        {optionElements}
      </div>
      <div className='margin-top'><hr className='hr' /></div>
    </div>
  )
}
