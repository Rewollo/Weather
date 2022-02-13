let cityName = 'Барнаул';
let city_get = document.getElementsByTagName('button')[0];
// массив дней недели для отображения текущего дня
const days = ["Sunday", "Monday", "Tuesday", "Wednesday",
"Thursday", "Friday", "Saturday"];
let popupBg = document.querySelector('.popup__bg');
let popup = document.querySelector('.popup');

// стартовая функция для получения данных погоды Барнаула, далее прикрутиться к window.onload
async function startData() {
  const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=bb84b4529da156a49b5233feb06b7cf9`);
  const weatherData = await response.json();
  console.log(weatherData); //консольки везде понатыканы для того, чтобы подсматривать ключи в объекте
  let currentCity = document.querySelector('#city_name');
  currentCity.innerHTML = weatherData.name;
  let currentTemp = document.querySelector('#current-temp-value');
  currentTemp.innerHTML = `${Math.trunc(weatherData.main.temp)}${'&deg;'}C`;
  let currentStatus = document.querySelector('#weather-status');
  currentStatus.innerHTML = weatherData.weather[0].main;
  let minTemp = document.querySelector('#min-temp');
  minTemp.innerHTML = `Min. temperature: ${Math.trunc(weatherData.main.temp_min)}${'&deg;'}C`;
  let maxTemp = document.querySelector('#max-temp');
  maxTemp.innerHTML = `Max. temperature: ${Math.trunc(weatherData.main.temp_max)}${'&deg;'}C`;
  let windSpd = document.querySelector('#wind-spd');
  windSpd.innerHTML = `Wind speed: ${weatherData.wind.speed} m/s`;
  let currentIcon = document.querySelector('#forecast-icon');
  currentIcon.style.backgroundImage = `url('http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png')`;
  //поскольку теперь есть данные с географическими координатами, то можем сделать запрос но ним
  //для получения почасовой погоды
  let latValue = weatherData.coord.lat;
  let lonValue = weatherData.coord.lon;
  const responseDay = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latValue}&lon=${lonValue}&units=metric&appid=bb84b4529da156a49b5233feb06b7cf9`);
  const dayData = await responseDay.json();
  console.log(dayData);
  let currentTime = dayData.current.dt*1000;
  let currentDate = new Date(currentTime);
  let weekDay = document.querySelector('#current-day');;
  weekDay.innerHTML = days[currentDate.getDay()];
  let currentDay = document.querySelector('#date');
  currentDay.innerHTML = `${currentDate.getDate()}.${currentDate.getMonth()+1}.${currentDate.getFullYear()}`
  //цикл, чтобы шесть раз не писать одно и то же в почасовой прогноз
  //почасовой прогноз идёт на +3 часа от текущего времени и так далее шесть раз
  for (let i = 0; i < 6; i++) {
    let hourlyTime = new Date(dayData.hourly[(i+1)*3].dt*1000);
    let time = document.getElementsByClassName('time')[i];
    time.innerHTML = `${hourlyTime.getHours()}:00`;
    let icon = document.getElementsByClassName('forecast-icon')[i];
    icon.style.backgroundImage = `url('http://openweathermap.org/img/wn/${dayData.hourly[(i+1)*3].weather[0].icon}@2x.png')`;
    let forecast = document.getElementsByClassName('forecast')[i];
    forecast.innerHTML = dayData.hourly[(i+1)*3].weather[0].main;
    let temperature = document.getElementsByClassName('temperature')[i];
    temperature.innerHTML = `${Math.trunc(dayData.hourly[(i+1)*3].temp)}${'&deg;'}C`;
    let wind = document.getElementsByClassName('wind')[i];
    wind.innerHTML = `${dayData.hourly[(i+1)*3].wind_speed} m/s`;
  }
}

//всплывающее окошко при ошибке ввода
function popupError() {
  popupBg.classList.add('active');
  popup.classList.add('active');
}

window.onload = startData();

city_get.addEventListener('click', async function (){
  //получаем название города из поля ввода и подставляем в запрос
  cityName = document.getElementsByTagName('input')[0].value;
  const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=bb84b4529da156a49b5233feb06b7cf9`);
  let weatherData;
  //проверяем на правильность запроса. Если есть такой город - всё ок. Нет города или undefined (400 и 404 cod) - видим popup.
  if (response.ok) {
    weatherData = await response.json();
  } else {
    popupError();
    document.addEventListener('click', (e) => {
      //убираем окно, кликая в любое место экрана. Ну и опять подставляем стартовые данные Барнаула
      if(e.target === popupBg || e.target === popup) {
          popupBg.classList.remove('active');
          popup.classList.remove('active');
          cityName = 'Барнаул';
          startData();
      }
    });
  }
  console.log(weatherData);
  startData();
})