const domRefs = {
  form: {
    _self: document.querySelector("#search-form"),
    input: document.querySelector("#search-form").querySelector("input"),
    button: document.querySelector("#search-form").querySelector("button")
  },
  w: {
    icon: document.querySelector(".icon"),
    location: document.querySelector('span[data-field="location"]'),
    humidity: document.querySelector('span[data-field="humidity"]'),
    wind: document.querySelector('span[data-field="wind"]'),
    conditions: document.querySelector('span[data-field="conditions"]')
  }
};

domRefs.form._self.addEventListener("submit", handleCitySubmit);

function ObjToStr(obj, divider) {
  let str = "";
  for (const entry of Object.entries(obj)) {
    str += divider + entry[0] + "=" + entry[1];
  }
  return str.slice(1);
}

function handleCitySubmit(e) {
  e.preventDefault();

  const dBase = "http://api.apixu.com/v1";
  const dBaseResource = "/current.json";
  const qParamsObj = {
    key: "86c35fa65a404206876174320190508",
    q: "Kiev",
    days: 5
  };
  const city = domRefs.form.input.value;
  qParamsObj.q = city === "" ? qParamsObj.q : city;
  
  const qParamsStr = ObjToStr(qParamsObj, "&");

  for (const entry of Object.entries(domRefs.form)) {
    entry.disabled = true;
  }

  fetch(dBase + dBaseResource + "?" + qParamsStr)
    .then(response => response.json())
    .then(weather => {
      applyWeatherInfo(weather);
    })
    .then(() => {
      for (const entry of Object.entries(domRefs.form)) {
        entry.disabled = false;
      }
    })
    .catch(error => console.log(error)
    );
}

function applyWeatherInfo(weather) {
  console.log(weather);
}
