//save reference to important DOM elements
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

//API key for Open Weather Data
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
    cityNameInputEl.value = "";
    getCoordinates(cityName);
    //check if the city name is already in the array of cities
    if (previousSearchesOfCities.indexOf(cityName) === -1) {
      addCityToSearchList(cityName);
      previousSearchesOfCities.push(cityName);
      setPreviousSearches(previousSearchesOfCities);
    } else {
      return;
    }
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
  //empty container
  displayCityWeatherEl.innerHTML = "";

  //create DOM elements
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
  //empty container
  cityWeatherForcastEl.innerHTML = "";
  // Weather Forcast gives an array of 40 data objects. These data are recorded for 5 days, each data representing 3-hour interval of the forcast
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

// the following function adds buttons to the list and displays the weather for that clicked city
var addCityToSearchList = function (city) {
  var cityButtonEl = document.createElement("button");
  cityButtonEl.textContent = city;
  cityButtonEl.className = "btn btn-list";
  searchHistoryContainerEl.prepend(cityButtonEl);
  cityButtonEl.addEventListener("click", function (event) {
    getCoordinates(event.target.textContent);
  });
};
var setPreviousSearches = function (cityList) {
  localStorage.setItem("searched-cities", JSON.stringify(cityList));
};
var getPreviousSearches = function () {
  var previousSearchList = JSON.parse(localStorage.getItem("searched-cities"));
  if (previousSearchList !== null) {
    previousSearchesOfCities = previousSearchList;
    displayCities();
  } else {
    //if the previous search list is empty, set the default city to Melbourne
    //defaultCity = "Melbourne";
    //getCoordinates(defaultCity);
    previousSearchesOfCities = [];
  }
};

var displayCities = function () {
  //variable to store a city name
  var defaultCity;
  for (var i = 0; i < previousSearchesOfCities.length; i++) {
    defaultCity = previousSearchesOfCities[i];
    addCityToSearchList(defaultCity);
  }
  //display weather details of latest city pushed into the array
  getCoordinates(previousSearchesOfCities[previousSearchesOfCities.length - 1]);
};

//initialisation
init();

// Event listener when "search" button is clicked
citySearchFormEl.addEventListener("submit", searchCityWeather);
