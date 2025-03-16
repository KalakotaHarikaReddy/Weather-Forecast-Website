import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [forecast, setForecast] = useState(null);/*weather data for current location*/
  const [error, setError] = useState("");/*storess error message*/
  const [manualLocation, setManualLocation] = useState("");/*manaul weather location*/
  const [manualForecast, setManualForecast] = useState(null);/*weather data for the manually entered location*/
  const [placeholderText, setPlaceholderText] = React.useState("Enter location");/*Controls the placeholder text in the input box, which can change dynamically*/


  const fetchWeather = async (latitude, longitude) => {
    try {
      const API_KEY = "648c22b757ed8ec8e9b84d4c1866fd32";
      const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
      const response = await axios.get(API_URL);
      setForecast(response.data);
      setError("");
    } catch (err) {
      setError("Unable to fetch weather data.");
      setForecast(null);
    }
  };

  const fetchManualWeather = async () => {
    try {
      const API_KEY = "648c22b757ed8ec8e9b84d4c1866fd32";
      const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${manualLocation}&units=metric&appid=${API_KEY}`;
      const response = await axios.get(API_URL);
      setManualForecast(response.data);
      setError("");
    } catch (err) {
      setError("Unable to fetch weather for the specified location.");
      setManualForecast(null);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        () => {
          setError("Location access denied.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const renderCurrentWeather = (data) => {
    if (!data) return null;
    return (
      <>
        <h3>Location: {data.city.name}</h3>
        <p>
          Temperature: {data.list[0].main.temp}°C | Condition:{" "}
          {data.list[0].weather[0].description}
        </p>
      </>
    );
  };
  
  const renderForecast = (data) => {
    if (!data) return null;
    const today = new Date().toDateString();
    const dailyForecast = new Map();
    data.list.forEach((item) => {
      const forecastDate = new Date(item.dt_txt).toDateString();
      if (forecastDate !== today && !dailyForecast.has(forecastDate)) {
        dailyForecast.set(forecastDate, item);
      }
    });
    const nextFiveDays = Array.from(dailyForecast.values()).slice(0, 5);
    return (
      <div className="forecast-list">
        {nextFiveDays.map((item, index) => (
          <div key={index} className="forecast-item">
            <p>Date: {new Date(item.dt_txt).toDateString()}</p>
            <p>Temp: {item.main.temp}°C | Condition: {item.weather[0].description}</p>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="app">
      <header className="header">
        <h1>Weather Forecast</h1>
      </header>
      <main className="main">
        {error && <p className="error">{error}</p>}
        <h2>Current Weather</h2>
        {renderCurrentWeather(forecast)}
  
        <h2>5-Day Forecast</h2>
        {renderForecast(forecast)}
  
        <h2>To see other location weather:</h2>
<input
  type="text"
  value={manualLocation}
  onChange={(e) => setManualLocation(e.target.value)}
  placeholder={placeholderText} // Dynamic placeholder
  onFocus={() => setPlaceholderText("Enter location")} // Reset placeholder on focus
/>
<button
  onClick={() => {
    fetchManualWeather(); // Call the function to fetch weather for the entered location
    setManualLocation(""); // Clear the input field after submission
    setPlaceholderText("Enter location"); // Reset placeholder to default
  }}
>
  Submit
</button>
        {manualForecast && (
          <>
            <h2>Current Weather</h2>
            {renderCurrentWeather(manualForecast)}
            <h2>5-Day Forecast</h2>
            {renderForecast(manualForecast)}
          </>
        )}
      </main>
    </div>
  );
};  
export default App;
