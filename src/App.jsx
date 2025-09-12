import { useState } from 'react'
import wind from './assets/wind.png'
import temp from './assets/temp.jpg'
import humidity from './assets/humidity.png'
import './App.css'

function App() {
  const [city, setCity] = useState("")
  const [weatherinfo, setWeatherinfo] = useState(null)
  const [suggetion, setSuggetion] = useState([])
  const apiKey = '4d80245bf29f4a63f0e8223fe2c0773a'
  function getSuggetion(query) {
    if (query.length < 2) {
      setSuggetion([])
      return
    }
    const surl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
    fetch(surl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSuggetion(data)
      })
  }
  
  function getWeather(selectedCity) {
    const CITY = selectedCity || city
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${apiKey}&units=metric`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setWeatherinfo({
          name: data.name,
          temparature: Math.floor(data.main.temp),
          description: data.weather[0].description,
          humidity1: data.main.humidity,
          wind: data.wind.speed,
          icon: data.weather[0].icon
        })
        setSuggetion([])
      })
  }
  return (
    <div className='weather-container'>
      <p id='box1'>My Weather App</p>
      <input  type='text' placeholder='Enter City Name...' value={city} onChange={(e) => {
        setCity(e.target.value)
        getSuggetion(e.target.value)
      }} />

      <button class="btn btn-outline-primary" onClick={()=>getWeather()}><i class="fa-solid fa-magnifying-glass"></i></button>
      {
        suggetion.length>0&&(
          <ul className="list-group" id='su'>
            {suggetion.map((s,index)=>(
              <li className="list-group-item" key={index} onClick={()=>{
                setCity(s.name)
                getWeather(s.name)
              }}>
                {s.name},{s.country}
              </li>
            ))}
          </ul>
        
        )
      }
      <br />
      <br />
      {weatherinfo && (
        <div>
          <h2>{weatherinfo.name}</h2>
          <img src={`https://openweathermap.org/img/wn/${weatherinfo.icon}@2x.png`} alt='Weather icon' />
          <p>{weatherinfo.description}</p>
          <p className='temp'><img id='img3' src={temp}/>{Math.floor(weatherinfo.temparature)}°C</p>
          <p className='hum'><img id='img1' src= {humidity}/> {weatherinfo.humidity1}%</p>
          <p className='hum0'><img id='img2' src= {wind}/> {weatherinfo.wind} km/h</p>
        </div>
      )}
    </div>
  )
}

export default App

