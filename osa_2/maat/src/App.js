import React, { useState, useEffect } from "react"
import axios from "axios"
import Results from "./components/Results"

function App() {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [search, setSearch] = useState("")

  const hook = () => {
    console.log("effect")
    axios
      .get("https://restcountries.com/v2/all")
      .then(response => {
        console.log("promise fulfilled")
        setCountries(response.data)
      })
  }

  useEffect(hook, [])

  console.log("render", countries.length, "countries")

  const handleSearch = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
    const filtered = countries.filter(country => {
      if (country.name.toLowerCase().includes(search.toLowerCase())) {
        return country
      }
    })
    setFilteredCountries(filtered)
  }


  return (
    <div className="App">
      find countries <input onChange={handleSearch} />
      <div>
        <Results filteredCountries={filteredCountries} setFilteredCountries={setFilteredCountries} />
      </div>
    </div>
  );
}

export default App;
