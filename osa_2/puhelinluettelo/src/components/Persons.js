import React from "react"
import Person from "./Person"

const Persons = ({ persons, search, delPerson }) => {
  return (
  <div>
    {persons.filter(person => {
      if (search === "") {
        return person
      } else if (person.name.toLowerCase().includes(search.toLowerCase())) {
        return person
      }
    }).map(person => 
      <Person key={person.name} person={person} removePerson={delPerson}/>
      )}
  </div>
  )
}

export default Persons