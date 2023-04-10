var citySearchFormEl = document.querySelector("#city-search-form");
var cityNameInputEl = document.querySelector("#search-field");
var searchButtonEl = document.querySelector("#btn-search");
var displayCityWeatherEl = document.querySelector(
  ".city-weather-detail-container"
);

var API_KEY = "2153b93d8fc7c1b3958691ab2de18220";

var searchCityWeather = function (event) {
  event.preventDefault();

  var cityName = cityNameInputEl.value.trim();

  if (cityName) {
    console.log(cityName);
    getCoordinates(cityName);
  } else {
    alert("Please enter a city name");
  }
};

var getCoordinates = function (cityName) {
  var latitude;
  var longitude;
  var urlGeolocation =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    API_KEY;
  fetch(urlGeolocation)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          latitude = data.coord.lat;
          console.log(latitude);
          longitude = data.coord.lon;
          console.log(longitude);
          getWeather(longitude, latitude, cityName);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather Geolocation API");
    });
};

function getWeather(lat, lon, cityName) {
  var urlWeather =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    API_KEY;
  fetch(urlWeather)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (weatherData) {
          console.log(weatherData);
          displayWeatherOfCity(weatherData, cityName);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather API");
    });
}

function displayWeatherOfCity(weatherData, cityName) {
  var chosenCityEl = document.createElement("h2");
  chosenCityEl.textContent = cityName;
  displayCityWeatherEl.appendChild(chosenCityEl);
}

citySearchFormEl.addEventListener("submit", searchCityWeather);
