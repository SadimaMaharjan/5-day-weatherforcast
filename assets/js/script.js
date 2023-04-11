var citySearchFormEl = document.querySelector("#city-search-form");
var cityNameInputEl = document.querySelector("#search-field");
var searchButtonEl = document.querySelector("#btn-search");
var displayCityWeatherEl = document.querySelector(
  ".city-weather-detail-container"
);
var cityWeatherForcastEl = document.querySelector(".city-weather-forcast");
var searchHistoryContainerEl = document.querySelector(
  ".search-history-container"
);

var API_KEY = "2153b93d8fc7c1b3958691ab2de18220";

//array to store previous searches of cities
var previousSearchesOfCities = [];

var init = function () {
  getPreviousSearches();
};

var searchCityWeather = function (event) {
  event.preventDefault();

  var cityName = cityNameInputEl.value.trim();

  if (cityName) {
    //console.log(cityName);
    getCoordinates(cityName);
    addCityToSearchList(cityName);
    previousSearchesOfCities.push(cityName);
    setPreviousSearches(previousSearchesOfCities);
  } else {
    alert("Please enter a city name");
  }
};

var getCoordinates = function (cityName) {
  var latitude;
  var longitude;
  var urlGeolocation =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&appid=" +
    API_KEY;
  fetch(urlGeolocation)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          latitude = data[0].lat;
          //console.log(latitude);
          longitude = data[0].lon;
          //console.log(longitude);
          getWeather(latitude, longitude, cityName);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather Geolocation API");
    });
};

var getWeather = function (lat, lon, cityName) {
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
          displayFiveDayForcast(weatherData);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather API");
    });
};

var displayWeatherOfCity = function (weatherData, cityName) {
  var chosenCityEl = document.createElement("h2");
  chosenCityEl.className = "selected-city";
  var spanDateEl = document.createElement("span");
  var imgIconEl = document.createElement("img");
  imgIconEl.setAttribute(
    "src",
    "https://openweathermap.org/img/w/" +
      weatherData.list[0].weather[0].icon +
      ".png"
  );
  var cityTempEl = document.createElement("li");
  cityTempEl.textContent =
    "Temp: " +
    (((weatherData.list[0].main.temp - 273.15) * 9) / 5 + 32).toFixed(2) +
    " °F";
  var cityWindEl = document.createElement("li");
  cityWindEl.textContent = "Wind: " + weatherData.list[0].wind.speed + " MPH";
  var cityHumidityEl = document.createElement("li");
  cityHumidityEl.textContent =
    "Humidity: " + weatherData.list[0].main.humidity + " %";
  //console.log(dayjs().format("DD / MM / YYYY"));
  spanDateEl.textContent = dayjs().format("DD / MM / YYYY");
  chosenCityEl.textContent =
    cityName + " " + "(" + spanDateEl.textContent + ")";
  displayCityWeatherEl.appendChild(chosenCityEl);
  displayCityWeatherEl.appendChild(imgIconEl);
  displayCityWeatherEl.appendChild(cityTempEl);
  displayCityWeatherEl.appendChild(cityWindEl);
  displayCityWeatherEl.appendChild(cityHumidityEl);
};

var displayFiveDayForcast = function (weatherData) {
  for (var i = 1; i <= 40; i += 8) {
    var forcastDetail = document.createElement("div");
    forcastDetail.className = "weather-detail col-lg-2 col-12";
    var dateEl = document.createElement("span");
    dateEl.className = "forcast-date";
    var iconEl = document.createElement("img");
    iconEl.setAttribute(
      "src",
      "https://openweathermap.org/img/w/" +
        weatherData.list[i].weather[0].icon +
        ".png"
    );
    var tempEl = document.createElement("li");
    tempEl.textContent =
      "Temp: " +
      (((weatherData.list[i].main.temp - 273.15) * 9) / 5 + 32).toFixed(2) +
      " °F";
    var windEl = document.createElement("li");
    windEl.textContent = "Wind: " + weatherData.list[i].wind.speed + " MPH";
    var humidityEl = document.createElement("li");
    humidityEl.textContent =
      "Humidity: " + weatherData.list[i].main.humidity + " %";
    //console.log(dayjs().format("DD / MM / YYYY"));
    dateEl.textContent = dayjs(weatherData.list[i].dt_txt).format(
      "DD / MM / YYYY"
    );
    forcastDetail.appendChild(dateEl);
    forcastDetail.appendChild(iconEl);
    forcastDetail.appendChild(tempEl);
    forcastDetail.appendChild(windEl);
    forcastDetail.appendChild(humidityEl);
    cityWeatherForcastEl.appendChild(forcastDetail);
  }
};

var addCityToSearchList = function (city) {
  var cityButtonEl = document.createElement("button");
  cityButtonEl.textContent = city;
  cityButtonEl.className = "btn btn-list";
  searchHistoryContainerEl.appendChild(cityButtonEl);
};
var setPreviousSearches = function (cityList) {
  localStorage.setItem("searched-cities", JSON.stringify(cityList));
};
var getPreviousSearches = function () {
  var previousSearchList = JSON.parse(localStorage.getItem("searched-cities"));
};

citySearchFormEl.addEventListener("submit", searchCityWeather);

init();
