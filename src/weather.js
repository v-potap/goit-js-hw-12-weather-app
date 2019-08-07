import CurrentWeatherService from "./weather-current";
import ForecastWeatherService from "./weather-forecast";
import weatherForecastTemplate from "./template/weather-forecast.hbs";

const domRefs = {
  form: {
    _self: document.querySelector("#search-form"),
    input: document.querySelector("#search-form").querySelector("input"),
    button: document.querySelector("#search-form").querySelector("button")
  },
  w: {
    _self: document.querySelector("#weather"),
    icon: document.querySelector(".icon"),
    location: document.querySelector('span[data-field="location"]'),
    temperature: document.querySelector('span[data-field="temp"]'),
    humidity: document.querySelector('span[data-field="humidity"]'),
    wind: document.querySelector('span[data-field="wind"]'),
    conditions: document.querySelector('span[data-field="conditions"]')
  }
};

domRefs.form._self.addEventListener("submit", handleCitySubmit);

function handleCitySubmit(e) {
  e.preventDefault();

  const currentWeather = new CurrentWeatherService();
  const forecastWeather = new ForecastWeatherService();

  for (const entry of Object.entries(domRefs.form)) {
    entry.disabled = true;
  }

  if (domRefs.form.input.value !== "") {
    currentWeather.setLocation(domRefs.form.input.value);
    currentWeather
      .get()
      .then(response =>
        applyWeatherCurrent(response.location, response.current)
      )
      .catch(error =>
        alert(
          `Location "${userLocation}"\ndoes not recogized by ${forecastWeather.getBase()}\nor service "Current Weather" is unavailable.`
        )
      );

    forecastWeather.setLocation(domRefs.form.input.value);
    forecastWeather
      .get()
      .then(response => applyWeatherForecast(response.forecast.forecastday))
      .catch(error =>
        alert(
          `Location "${userLocation}"\ndoes not recogized by ${forecastWeather.getBase()}\nor service "Weather Forecast" is unavailable.`
        )
      );

    domRefs.form._self.reset();
  } else {
    // CODE FOR GET GEO POSITION

    const getCurrentPosition = () => {
      const options = {
        timeout: 5000
      };

      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    getCurrentPosition()
      .then(location => {
        currentWeather.setLocation(
          `${location.coords.latitude} ${location.coords.longitude}`
        );
        currentWeather
          .get()
          .then(response =>
            applyWeatherCurrent(response.location, response.current)
          )
          .catch(error =>
            alert(
              `Location "${userLocation}"\ndoes not recogized by ${forecastWeather.getBase()}\nor service "Current Weather" is unavailable.`
            )
          );

        forecastWeather.setLocation(
          `${location.coords.latitude} ${location.coords.longitude}`
        );
        forecastWeather
          .get()
          .then(response => applyWeatherForecast(response.forecast.forecastday))
          .catch(error =>
            alert(
              `Location "${userLocation}"\ndoes not recogized by ${forecastWeather.getBase()}\nor service "Weather Forecast" is unavailable.`
            )
          );
      })
      .catch(error => {
        userLocation = "UNDEFINED";
      });

    console.log(currentWeather.getLocation());
    console.log(forecastWeather.getLocation());
  }

  for (const entry of Object.entries(domRefs.form)) {
    entry.disabled = false;
  }
}

function applyWeatherCurrent(location, current) {
  domRefs.w.icon.src = `https:${current.condition.icon}`;
  domRefs.w.icon.alt = current.condition.text;
  domRefs.w.location.innerHTML = `${location.name}<br>(${location.region}, ${
    location.country
  })<br>Lt/Ln: ${location.lat}, ${location.lon}`;
  domRefs.w.temperature.innerHTML = `${current.temp_c}&#8451`;
  domRefs.w.humidity.innerHTML = current.humidity;
  domRefs.w.wind.innerHTML = `${current.wind_dir} ${current.wind_kph}kph`;
  domRefs.w.conditions.innerHTML = current.condition.text;

  domRefs.w._self.classList.remove("is-hidden");
}

function applyWeatherForecast(forecast) {
  const markup = buildWeatherForecastMurkup(forecast);
  const forecastSection = document.querySelector("#forecast");
  if (forecastSection !== null) {
    forecastSection.remove();
  }

  domRefs.w._self.insertAdjacentHTML("afterend", markup);
}

function buildWeatherForecastMurkup(items) {
  return weatherForecastTemplate(items);
}
