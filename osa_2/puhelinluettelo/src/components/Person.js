import React from "react"

const Person = ({ person, removePerson }) => {
  return (
    <li>
      {person.name} {person.number}
      <button onClick={() => removePerson(person.name, person.id)}>delete</button>
    </li>
  )
}

export default Person