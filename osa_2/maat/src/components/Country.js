import React, { useState, useEffect} from "react"
import axios from "axios"

const Country = ({ country }) => {
    const [weather, setWeather] = useState([])

    const api_key = process.env.REACT_APP_API_KEY

    useEffect(() => {
      axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}&units=metric`)
      .then(response => {
        console.log(response)
        console.log(`Current temperature in ${response.data.name} is ${response.data.main.temp}℃`)
        setWeather(response.data)
      })
    }, [country.capital])

    console.log(weather)
    
    
    if (weather.length === 0) {
      return (
        <div>
        <h1>{country.name}</h1>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
        <b>languages:</b>
        <ul>
          {country.languages.map(language => 
            <li key={language.name}>
              {language.name}
            </li>
            )}
        </ul>
        <img src = {country.flags.png} />
        </div>
      )
    } else {
      return (
        <div>
        <h1>{country.name}</h1>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
        <b>languages:</b>
        <ul>
          {country.languages.map(language => 
            <li key={language.name}>
              {language.name}
            </li>
            )}
        </ul>
        <img src = {country.flags.png} />
        <h2> Weather in {country.capital}</h2>
        <p>temperature is {weather.main.temp} C</p>
        <img src = {`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
        <p>wind {weather.wind.speed} m/s </p>
        </div>
      )
    }
}

export default Country