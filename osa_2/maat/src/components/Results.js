import React from "react"
import Country from "./Country"

const Results = ({ filteredCountries, setFilteredCountries }) => {
  

    console.log(filteredCountries)
    if (filteredCountries.length > 10 ) {
      return (
        <p>too many matches, specify another filter</p>
      )
    } else if (filteredCountries.length <= 10 && filteredCountries.length > 1) {
      return (
        filteredCountries.map(country => {
          return (
            <li key={country.name}>
              {country.name} 
              <button onClick={() => setFilteredCountries([country])}>show</button>
            </li>
          )
        })
      )
    } else if (filteredCountries.length === 1) {
      return (
        <Country country={filteredCountries[0]} />
      )
    }
}

export default Results
