export default class WeatherService {
  constructor({
    dBase = "https://api.apixu.com/v1",
    dKey = "86c35fa65a404206876174320190508",
    location = "Kiev"
  }) {
    this.dBase = dBase;
    this.dKey = dKey;
    this.location = location;
  }

  getBase() {
    return this.dBase;
  }

  setLocation(location) {
    this.location = location;
  }

  getLocation() {
    return this.location;
  }
}
