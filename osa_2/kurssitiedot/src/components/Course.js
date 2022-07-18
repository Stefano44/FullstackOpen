import React from "react"

const Course = ({ course }) => {
    return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

const Header = ({ course }) => {
  return (
      <div>
        <h2>{course.name}</h2>
      </div>
    )
}

const Content = ({ course }) => {
return(
  <div>
    {course.parts.map(part =>
      <Part key={part.id} part={part} exercises={part} />
    )}
  </div>
)
}

const Part = ({ part }) => {
  return (
      <p>
        {part.name} {part.exercises}
      </p>
  )
}

const Total = ({ course }) => {
  const all = course.parts.reduce(function(sum, part){
      return sum + part.exercises
  }, 0)
  
  return(
      <p>total of {all} exercises</p>
  )
}

export default Course