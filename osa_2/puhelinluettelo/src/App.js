import { useState, useEffect } from 'react'
import Persons from "./components/Persons"
import Filter from "./components/Filter"
import personService from "./services/persons"

const Notification = ({message}) => {
  if (message === null) {
    return null
  } else if (message.includes("removed")) {
    return (
      <div className="error"> 
        {message}
      </div>
    )
  }

  return (
    <div className="added"> 
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState("")
  const [search, setSearch] = useState("")
  const [addMessage, setAddMessage] = useState("")


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  console.log("render", persons.length, "persons")

  const addPerson = (event) => {
    event.preventDefault()
    console.log("button clicked", event.target)

    const nameObject = {
      name: newName,
      number: newNum
    }

    console.log(nameObject)
    console.log(persons)
    console.log(persons.includes(newName))


    if (persons.map((person) => person.name).includes(newName)) {
      console.log("löytyy")
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const changedPerson = { ...person, number: newNum}
        const id = person.id
        

        personService
          .update(id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
          })
          .catch(error => {
            setAddMessage(
              `Inormation of ${newName} has already been removed from server`
            )
            setTimeout(() => {
              setAddMessage(null)
            }, 5000)
          })
        
        setAddMessage(
          `Updated ${newName} `
        )
        setTimeout(() => {
          setAddMessage(null)
        }, 5000)
      } else {
        return
      }
    } else {
      console.log("ei löydy")
      
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName("")
          setNewNum("")
          setAddMessage(
            `Added ${newName}`
          )
          setTimeout(() => {
            setAddMessage(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (name, id) => {
    console.log("clicked")
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        setAddMessage(
          `Deleted ${name} `
        )
        setTimeout(() => {
          setAddMessage(null)
        }, 5000)
      }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumChange = (event) => {
    console.log(event.target.value)
    setNewNum(event.target.value)
  }

  const handleSearch = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
  }

  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addMessage} />
      <Filter value={search} onChange={handleSearch} />
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNum} onChange={handleNumChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} delPerson={deletePerson} />
    </div>
  )

}



export default App