import React from 'react'
import './App.css'
import BeginScreen from './BeginScreen.jsx'
import Question from './comps/QuizQuestion.jsx'
import Modal from './comps/Modal'

export default function App() {

  const [fetchData, setFetchData] = React.useState([]) //was questions
  const [questions, setQuestions] = React.useState([]) //was selection
  const [displayDropdown, setDisplayDropdown] = React.useState(false)
  const [results, setResults] = React.useState({ resultOut: false, score: "" })
  const [playAgain, setPlayAgain] = React.useState(0)
  const [gameStarted, setGameStarted] = React.useState(false)

  function startGame() {
    setGameStarted(true)
  }

  React.useEffect(function () {
    fetch("https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple")
      .then(res => res.json())
      .then((data) => { setFetchData(data.results) })
  }, [playAgain])

  React.useEffect(function () { //initialises value of questions state
    if (fetchData.length === 0) {
      return;
    }
    let prepareQuestionsState = fetchData.map((data) => {
      //randomising order of correct answer by inserting it between incorrect answer
      let shuffledOptions = [];
      let randomIndex = Math.floor(Math.random() * data.incorrect_answers.length) + 1 //can be from 0, 1, 2, 3 ; +1 gives 3, i.e. last index
      for (let i = 0; i < data.incorrect_answers.length + 1; ++i) {
        if (i == randomIndex)
          shuffledOptions.push(data.correct_answer)

        if (i == data.incorrect_answers.length) { //wanted to add possibility for correct_answer to be at the end of index, but when it is not, end of index is getting pushed undefined because data.incorrect_answers[data.incorrect_answers.length] doesnt exist
          break;
        }
        shuffledOptions.push(data.incorrect_answers[i])
      }
      //randomising done

      return { question: data.question, options: shuffledOptions, correct_answer: data.correct_answer, selected_answer: "" }
    }
    )//map end

    setQuestions(prepareQuestionsState)

  }, [fetchData])

  const questionElements = questions.map((question, index) => {
    return <Question key={index} name={index} question={question.question} correct_option={question.correct_answer}
      options={question.options} selected_option={question.selected_answer} handleOptionClick={handleOptionClick} resultOut={results.resultOut}
    />
  })

  function handleOptionClick(event) {
    event.stopPropagation()

    if (results.resultOut == false) {
      const { name, value } = event.target;
      setQuestions((prevState) => {
        const newState = prevState.map((question, index) => {
          let newQuestion = question;
          if (index == name) {
            newQuestion = { ...question, selected_answer: value }
          }
          return newQuestion
        })
        return newState
      })
    }

  }

  function handleActionButtonClick() {

    if (results.resultOut === false) {
      const unansweredQuestion = questions.find(function (question) {
        return question.selected_answer === ""
      })
      if (unansweredQuestion) {
        setDisplayDropdown(true)
      }
      else { //all questions answered
        let noOfCorrectAnswers = 0;

        for (let index = 0; index < questions.length; ++index)
          if (questions[index].correct_answer == questions[index].selected_answer)
            ++noOfCorrectAnswers;

        setResults((prevState) => {
          return { resultOut: true, score: noOfCorrectAnswers }
        })
      }
    }
    else { //clicking button after results are out

      setPlayAgain((prevState) => (prevState + 1))
      setResults({ resultOut: false, score: "" })

      setQuestions((prevState) => {
        return prevState.map((question) => ({ ...question, selected_answer: "" }))
      })
    }
  }//end handleActionButtonClick

  function closeModal(e) {
    console.log(e.target)
    if (e.target.id != 'modal') {
      e.stopPropagation();
      setDisplayDropdown(false)
    }
  }

  return (
    <div className='app'>
      {displayDropdown && <Modal closeModal={closeModal} />}
      {gameStarted == false ?
        <BeginScreen startGame={startGame} />
        :
        <>
          {questionElements}
          <div className='bottom-div margin-top'>
            {results.resultOut && <div className='score-message'>You scored {results.score}/{questions.length} correct answers</div>}
            <div><button className='action-button' onClick={handleActionButtonClick}>
              {`${results.resultOut ? `Play again` : `Check answers`}`}
            </button></div>
          </div>
        </>
      }
    </div>

  )
}