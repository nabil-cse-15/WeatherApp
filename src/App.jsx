import { useState } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState("")
  const [weatherinfo, setWeatherinfo] = useState(null)
  const [suggetion, setSuggetion] = useState([])
  const [forecast, setForecast] = useState([])
  const apiKey = '4d80245bf29f4a63f0e8223fe2c0773a'

  function formatDate(unixTime) {
    const date = new Date(unixTime * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function getSuggetion(query) {
    if (query.length < 2) {
      setSuggetion([])
      return
    }
    const surl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
    fetch(surl)
      .then((response) => response.json())
      .then((data) => {
        setSuggetion(data)
        console.log(data)
      })
  }

  function getWeather(selectedCity) {
    const CITY = selectedCity || city
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${apiKey}&units=metric`
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
          icon: data.weather[0].icon,
          feels_like: data.main.feels_like,
          pressure: data.main.pressure,
          visibilty: data.visibility,
        })
        setSuggetion([])
      })
  }


  function getForecast(selectedCity) {
    const CITY = selectedCity || city;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        const hourlyData = data.list.slice(0, 8).map(item => ({
          time: item.dt,
          temp: Math.floor(item.main.temp),
          icon: item.weather[0].icon,
          description: item.weather[0].description
        }));
        setForecast(hourlyData);
      });
  }

  return (
    <div className='app-container'>
      <h3>My Weather App</h3>
      <input type='text' placeholder='Enter City Name...' value={city} onChange={(e) => {
        setCity(e.target.value)
        getSuggetion(e.target.value)
      }} />
      <button id='but1' className="btn btn-outline-primary" onClick={() => getWeather()}>Search</button>

      {suggetion.length > 0 && (
        <ul className="list-group" id='su'>
          {suggetion.map((s, index) => (
            <li className="list-group-item" key={index} onClick={() => {
              setCity(s.name)
              getWeather(s.name)
            }}>
              {s.name} , {s.state} , {s.country}
            </li>
          ))}
        </ul>
      )}

      {weatherinfo && (
        <div>
          <h2>{weatherinfo.name}</h2>
          <img src={`https://openweathermap.org/img/wn/${weatherinfo.icon}@2x.png`} alt='Weather icon' />
          <p>{weatherinfo.description}</p>
          <b className='temp'>{weatherinfo.temparature}°C</b>
          <p> Feels Like: {Math.floor(weatherinfo.feels_like)} °C</p>
          <p className='hum'>Humidity: {weatherinfo.humidity1}%</p>
          <p>WindSpeed: {weatherinfo.wind} km/h</p>
          <p>Pressure: {weatherinfo.pressure} mPa</p>
          <p>Visibility: {weatherinfo.visibilty} m</p>
          <button id='get1' className="btn btn-outline-dark" onClick={() => getForecast()}>GetForecast</button>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast">
          <h3>Hourly Forecast (Next 24h)</h3>
          <div className="forecast-grid">
            {forecast.map((hour, index) => (
              <div key={index} className="forecast-card">
                <p>{formatDate(hour.time)}</p>
                <img src={`https://openweathermap.org/img/wn/${hour.icon}@2x.png`} alt={hour.description} />
                <p>{hour.temp}°C</p>
                <p>{hour.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


export default App
