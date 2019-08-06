import WeatherService from './weather-service';

export default class ForecastWeatherService extends WeatherService {
  constructor(location, days = 7) {
    super({ location });
    this.dResource = "/forecast.json";
    this.days = days;
  }
  get() {
    const query = `${this.dBase}${this.dResource}?key=${this.dKey}&q=${this.location}&days=${this.days}`;
    return fetch(query)
      .then(response => response.json())
      .catch(error => {throw new Error(error)});
  }
}
