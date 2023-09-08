import { useEffect, useMemo, useState } from "react";

const api = {
  key: "b4e7b0745b1d5c4734c75f782836c4a7",
  baseUrl: "http://api.openweathermap.org/data/2.5/",
};

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [coords, setCoords] = useState({
    lon: null,
    lat: null,
  });

  // const [latitude, setLatitude] = useState(null);
  // const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCoords({
            lon: position.coords.longitude,
            lat: position.coords.latitude,
          });
        },
        error => {
          setError(error.message);
        }
      );
    };

    getLocation();
    console.log("run");
  }, []);

  useEffect(() => {
    if (coords.lat !== null && coords.lon !== null) {
      const loadData = async () => {
        try {
          const response = await fetch(
            `${api.baseUrl}weather/?lat=${coords.lat}&lon=${coords.lon}&units=metric&APPID=${api.key}`
          );

          if (!response.ok) {
            throw new Error("API request failed");
          }

          const data = await response.json();
          setWeather(data);
          console.log(data.weather[0].description);
        } catch (error) {
          console.error("Something went wrong", error);
        }
      };
      loadData();
    }
  }, [coords.lon, coords.lat]);

  const searchWeather = evt => {
    if (evt.key === "Enter") {
      fetch(`${api.baseUrl}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(result => result.json())
        .then(data => {
          setWeather(data);
          setQuery("");
          console.log(data);
        });
    }
  };

  const dateBuilder = d => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[d.getDay()];
    let date = d.getDate(); // to get the day of the month
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    let hour = d.getHours();
    let minutes = d.getMinutes();

    return `${day} ${date} ${month} ${year} `;
  };

  const changeBackgroundWeather = () => {
    switch (weather?.weather[0]?.description) {
      case "few clouds":
        return "App few-clouds";
      case "clear sky":
        return "App clear-sky";
      case "scattered clouds":
        return "App scattered-clouds";
      case "snow":
        return "App snow";
      case "rain":
        return "App rain";
      case "overcast clouds":
        return "App overcast-clouds";
      case "broken clouds":
        return "App broken-clouds";
      case "light rain":
        return "App light-rain";
      default:
        return "App";
    }
  };

  return (
    <div className={changeBackgroundWeather()}>
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyDown={searchWeather}
          />
        </div>
        {weather && weather.weather && weather.weather[0] ? (
          <div>
            <div className="location-box">
              <div className="location">
                {weather.name}, {weather.sys.country}
              </div>
              <div className="date">{dateBuilder(new Date())}</div>
              <div className="weather-box">
                <div className="temp">{Math.floor(weather.main.temp)}°c</div>
                <div className="weather">{weather.weather[0].main}</div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </main>
    </div>
  );
}

export default App;
