import React, {useState} from "react"

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistics = ({ good, neutral, bad, average }) => {
  const all = good + neutral + bad
  const positive = good / all * 100

  if (all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <tbody>
        <tr>
          <td><StatisticLine text="good" /></td>
          <td><StatisticLine value={good} /></td>
        </tr>
        <tr>
          <td><StatisticLine text="netural" /></td>
          <td><StatisticLine value={neutral} /></td>
        </tr>
        <tr>
          <td><StatisticLine text="bad" /></td>
          <td><StatisticLine value={bad} /></td>
        </tr>
        <tr>
          <td><StatisticLine text="all" /></td>
          <td><StatisticLine value={all} /></td>
        </tr>
        <tr>
          <td><StatisticLine text="average" /></td>
          <td><StatisticLine value={average / all} /></td>
        </tr>
        <tr>
          <td><StatisticLine text="positive" /></td>
          <td><StatisticLine value={positive} /></td>
          <td><StatisticLine text="%" /></td>
        </tr>
      </tbody>
    </table>
  )

}

const StatisticLine = ({ text, value }) =>{
  return (
    <p>
      {text} {value}
    </p>
  )
}

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [average, setAverage] = useState(0)

  const handleGood = () =>  {
    setAverage(average + 1)
    setGood(good +1)
  }  
  const handleNeutral = () => {
    setNeutral(neutral +1)
  }
  const handleBad = () =>  {
    setAverage(average - 1)
    setBad(bad +1)
  } 

  return(
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGood} text="good" />
      <Button handleClick={handleNeutral} text="neutral" />
      <Button handleClick={handleBad} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} average={average} />
    </div>
  )
}

export default App