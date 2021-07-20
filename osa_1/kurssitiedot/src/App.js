import React from 'react'

const Header = (props) => {
  
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.name} {props.exercises}</p>
    </div>
  )
}

const Content = (props) => {
  console.log(props)
  const parts = props.parts
  return(
    <div>
      <Part name={parts[0].name} exercises={parts[0].exercises} />
      <Part name={parts[1].name} exercises={parts[1].exercises} />
      <Part name={parts[2].name} exercises={parts[2].exercises} />
    </div>
  )
}

const Total = (props) => {
  const parts = props.parts
  const total = parts[0].exercises + parts[1].exercises + parts[2].exercises
  return (
    <div>
      <p> Number of exercises {total}</p>
    </div>
  )
}

const App = () => {
  const course = {
    name:'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
      name: 'Using props to pass data',
      exercises: 7
      }, 
      {
      name :'State of a component',
      exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App
