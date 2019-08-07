import WeatherService from "./weather-service";

export default class CurrentWeatherService extends WeatherService {
  constructor(location) {
    super({ location });
    this.dResource = "/current.json";
  }
  get() {
    const query = `${this.dBase}${this.dResource}?key=${this.dKey}&q=${
      this.location
    }`;
    return fetch(query).then(response => response.json());
  }
}
