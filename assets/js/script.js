
let currentDate = dayjs().format("MMM-DD-YYYY");
var timeDisplayEl = $("#time-display");
const WEATHER_API_KEY = "313e19582894eb8e201b929fa986e291";
const GEOTOMTOM_API_KEY = "fEpXmh3qP1JYzUnM3EIZjqSnqkCkvAPk";
var redirectUrl = './404.html';
let weatherDetails = document.querySelector(".weather-detail");
let searchBtn = document.querySelector(".search-btn");
let searchInput = document.querySelector(".city-input");
let clearBtn = document.querySelector(".clear-btn");
let cityList = [];
let butt_arr = [];







function displayTimeDashBoard() {
  var rightNow = dayjs().format("MMM DD, YYYY [at] hh:mm:ss a");
  timeDisplayEl.text(rightNow);
  setInterval(displayTimeDashBoard, 1000);
}


async function GETGEOLocation (locationName){
  try{
    var ObjectLocation={};
var GeolocationName = locationName.trim().replaceAll(/\s+/g, '&');
var locationTOMTOM =`https://api.tomtom.com/search/2/geocode/${GeolocationName}.json?key=${GEOTOMTOM_API_KEY}&limit=1`

//console.log(locationTOMTOM);
const response = await fetch(locationTOMTOM);
if (response.status !== 200) {

  document.location.href = redirectUrl;
  
}
const locationData = await response.json();
//console.log(locationData);
  // if(confirm(`Did you mean ${locationData.results[0].address.freeformAddress.split(', ')[0]}, ${locationData.results[0].address.countrySubdivision} 
  //   ${locationData.results[0].address.country} ?`) == false) // if the user click cancel, then alert the user to re-check the input
  // {
  //   console.log('cancel');
  //   return alert(`${locationName} is invalid, please re-check the input`); 
  // }

ObjectLocation.locationName = locationData.results[0].address.freeformAddress;
ObjectLocation.lat = locationData.results[0].position.lat;
ObjectLocation.lon = locationData.results[0].position.lon;

if(!butt_arr.includes(ObjectLocation.locationName))
{

   butt_arr.push(ObjectLocation.locationName);
   cityList.push(ObjectLocation);
 
}

//console.log(cityList);
localStorage.setItem('cityListObject', JSON.stringify(cityList));

return ObjectLocation;

  }
  catch (error) {
        console.error(error);
        return null;
      }

}

  
 // return the object location
// (async () => {
//   let heo = await GETGEOLocation('san jose');
//   console.log(heo);
// })();



async function getFivedayForecast(latitude, longitude){

  const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`;

  //console.log(FORECAST_URL);
  const response = await fetch(FORECAST_URL);
  if(response.status !== 200)
  {
    document.location.href = redirectUrl;
  } 

  const forecastData = await response.json();
  //console.log(forecastData);

  //console.log(typeof (forecastData.list[0].dt_txt));
  //console.log(forecastData.list[0].dt_txt.split(' ')[0]);
  //console.log(currentDate);
  const fiveDayArray = [];
  const fiveDayForcastObject = [];
  for(let i =0; i<forecastData.list.length; i++)
  {
    if(!fiveDayArray.includes(forecastData.list[i].dt_txt.split(' ')[0]))
    {
      fiveDayArray.push(forecastData.list[i].dt_txt.split(' ')[0]);
      fiveDayForcastObject.push(forecastData.list[i]);
    }


  }

  //console.log(fiveDayForcastObject);
  
  $(".forecast-container").empty();
  for(let i =0; i<fiveDayForcastObject.length; i++)
  {
    const tempF = Math.round((fiveDayForcastObject[i].main.temp - 273.15) * 9/5 + 32);
    const forecastCard = document.createElement('div');
    forecastCard.setAttribute('class', 'card forecast-card');
    forecastCard.setAttribute('style', 'width: 18rem');

    const forecastCardBody = document.createElement('div');
    forecastCardBody.setAttribute('class', 'card-body');

    const forecastCardDate = document.createElement('h5');
    forecastCardDate.setAttribute('class', 'card-title');

    forecastCardDate.textContent = fiveDayForcastObject[i].dt_txt.split(' ')[0]; // get the date from the dt_txt

    const forecastCardText = document.createElement('p');
    forecastCardText.setAttribute('class', 'card-text');
    forecastCardText.textContent = `Temp: ${tempF}°F`; // get the temperature from the main object

    const forecastCardIMG = document.createElement('img');
    forecastCardIMG.setAttribute('class', 'card-img');
    forecastCardIMG.setAttribute('src', `https://openweathermap.org/img/w/${fiveDayForcastObject[i].weather[0].icon}.png`); // get the icon from the weather object
    const forecastCardDesciption = document.createElement('p');
    forecastCardDesciption.setAttribute('class', 'card-desciption');
    forecastCardDesciption.textContent = `${fiveDayForcastObject[i].weather[0].description}`; // get the description from the weather object;
   
    forecastCardBody.appendChild(forecastCardDate);
    forecastCardBody.appendChild(forecastCardText);
    forecastCardBody.appendChild(forecastCardIMG);
    forecastCardBody.appendChild(forecastCardDesciption);
    forecastCard.appendChild(forecastCardBody);
    $(".forecast-container").append(forecastCard);
  }

}


 async function GETWEATHER(obJectLocation){
  try{
  const ObjectWeather = {};
  const  weatherLocation = await obJectLocation;
  //console.log(weatherLocation);
  const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${weatherLocation.lat}&lon=${weatherLocation.lon}&appid=${WEATHER_API_KEY}`;
  //console.log(WEATHER_URL);
  await getFivedayForecast(weatherLocation.lat, weatherLocation.lon); // get the five day forecast
  const response = await fetch(WEATHER_URL);
  if(response.status !==200)
  {
    document.location.href = redirectUrl
  }
  const weatherData = await response.json();
  //console.log(weatherData);
  ObjectWeather.weather = weatherData.weather[0].description;
  ObjectWeather.temp = weatherData.main.temp;
  ObjectWeather.humidity = weatherData.main.humidity;
  ObjectWeather.wind_speed = weatherData.wind.speed;
  ObjectWeather.icon = weatherData.weather[0].icon;
  ObjectWeather.locationName = weatherLocation.locationName + ' ' + weatherData.sys.country;
  return ObjectWeather; // return the object weather
  }
  catch(error){
    console.error(error);
    return null;
  }
  
 }
  



async function displayWeather(placeName){
 
  const displayWeatherObject = await GETWEATHER(GETGEOLocation(placeName));
  //console.log(displayWeatherObject);
  const tempF = Math.round((displayWeatherObject.temp - 273.15) * 9/5 + 32);
  //console.log(tempF);
  const arrayWeatherDisPlay = [displayWeatherObject.locationName, `Temp: ${tempF}°F`, 
                              `Wind: ${displayWeatherObject.wind_speed} MPH`, 
                              `Humidity: ${displayWeatherObject.humidity}%`,
                              `Condition: ${displayWeatherObject.weather}`];

  for(let i =0; i<weatherDetails.children.length; i++){

    weatherDetails.children[i].textContent = arrayWeatherDisPlay[i];
  }

$(".weather-icon h3").text(displayWeatherObject.weather);
$(".current-weather").css("background-image", `url(assets/img/${displayWeatherObject.icon}.webp)`);


}


async function handleSearchBtnClick(event){
  event.preventDefault();
  await displayWeather(searchInput.value);
  await getWeatherHistory();
  searchInput.value = "";
 

}


async function getWeatherHistory()
{
  $(".list-group").empty();
let RetrievedObject_cityList = await JSON.parse(localStorage.getItem('cityListObject'));
if(RetrievedObject_cityList !== null)
{
  for(let i =0; i<RetrievedObject_cityList.length; i++)
  {
    //console.log(RetrievedObject_cityList[i].locationName);
    let listCity = document.createElement('li');
    let button = document.createElement('button');
    let removeCity = document.createElement('button');
    button.textContent = RetrievedObject_cityList[i].locationName; 
    removeCity.textContent = '❌';   
    button.setAttribute('class', 'btn btn-primary');
    button.setAttribute('id', 'butt'+i);
    // set the width of the button to 100% if the screen width is less than 768px else set it to 50%
    button.setAttribute('style', window.innerWidth < 768 ? 'width: 25%' : 'width: 50%'); 
    button.setAttribute('style', 'word-wrap: break-word');
    removeCity.setAttribute('class', 'btn btn-danger');
    removeCity.setAttribute('id', 'removeButt'+i);
    removeCity.setAttribute('style', 'margin-left: 10px');
    $(".list-group").append(document.createElement('br')); 
    $(".list-group").append(listCity);  
    listCity.appendChild(button);
    listCity.appendChild(removeCity);
 
  }
    await displayWeatherHistory();
    await removeWeatherHistory();
}
 
}


async function removeWeatherHistory(){
  let RemoveSpecificItem = await JSON.parse(localStorage.getItem('cityListObject'));
  for(let i =0; i<RemoveSpecificItem.length; i++)
  {
    if(document.getElementById('removeButt'+i) === null||document.getElementById('removeButt'+i) === undefined)
    {
      alert('removeButt'+i+' is null');
      return;
    }
    
    document.getElementById('removeButt'+i).addEventListener('click', async function(){
      if(RemoveSpecificItem.length === 1)
      {
        localStorage.clear("cityListObject");
        $(".list-group").empty();
        cityList = [];
        butt_arr = [];
        //console.log(cityList);
        //console.log(butt_arr);
        alert('All history has been cleared');
        return;
      }
    RemoveSpecificItem.splice(i, 1);
    localStorage.setItem('cityListObject', JSON.stringify(RemoveSpecificItem)); // update the local storage
    await getWeatherHistory();
    });

  }
}

async function displayWeatherHistory(){
  let Display_cityList = await JSON.parse(localStorage.getItem('cityListObject'));
  for(let i =0; i<Display_cityList.length; i++)
  {
    //console.log(Display_cityList[i].locationName);
    if(document.getElementById('butt'+i) !== null)
    {
    document.getElementById('butt'+i).addEventListener('click', async function(){
          await displayWeather(Display_cityList[i].locationName);
 
  });
}
else{
  return;
}
}
}








async function init ()
{
  displayTimeDashBoard();
  await getWeatherHistory();
}



 init();

searchBtn.addEventListener("click", handleSearchBtnClick);
clearBtn.addEventListener("click", function(){
  if(localStorage.getItem("cityListObject") === null )
  {
    return alert('No history to clear');
  }
  localStorage.clear("cityListObject");
  $(".list-group").empty();
  cityList = [];
  butt_arr = [];
  //console.log(cityList);
  //console.log(butt_arr);
  alert('All history has been cleared');

 });


 $(".location-btn").on("click", async function(){

  await navigator.geolocation.getCurrentPosition(
    (UserPosition) => {
      const { latitude, longitude } = UserPosition.coords; // Get coordinates of user location
      // Get city name from coordinates using reverse geocoding API
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`;
      fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
          
          const cityName = data.name;
          alert('Your current location is being displayed in '+ cityName);
          displayWeather(cityName);
        })
        .catch(() => {
          alert("An error occurred while fetching the city name!");
        });
    },
    (error) => {
      // Show alert if user denied the location permission
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolocation request denied. Please reset location permission to grant access again."
        );
      } else {
        alert("Geolocation request error. Please reset location permission.");
      }
    }
  );
 });





