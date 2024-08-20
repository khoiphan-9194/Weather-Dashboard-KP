
let currentDate = dayjs().format("MMM-DD-YYYY");
const WEATHER_API_KEY = "313e19582894eb8e201b929fa986e291";
const GEOTOMTOM_API_KEY = "fEpXmh3qP1JYzUnM3EIZjqSnqkCkvAPk";
var redirectUrl = './404.html';
let weatherDetails = document.querySelector(".weather-detail");
let searchBtn = document.querySelector(".search-btn");
let searchInput = document.querySelector(".city-input");
const cityList = [];
const butt_arr = [];


async function GETGEOLocation (locationName){
  try{
    var ObjectLocation={};
var GeolocationName = locationName.trim().replaceAll(/\s+/g, '&');
var locationTOMTOM =`https://api.tomtom.com/search/2/geocode/${GeolocationName}.json?key=${GEOTOMTOM_API_KEY}&limit=1`
console.log(locationTOMTOM);
const response = await fetch(locationTOMTOM);
if (response.status !== 200) {

  document.location.href = redirectUrl;
  
}
const locationData = await response.json();
console.log(locationData);
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

console.log(cityList);
localStorage.setItem('cityListObject', JSON.stringify(cityList));







return ObjectLocation;

  }
  catch (error) {
        console.error(error);
        return null;
      }

}

  
//  // return the object location
// (async () => {
//   let heo = await GETGEOLocation('sunnyvale');
//   console.log(heo);
// })();


 async function GETWEATHER(obJectLocation){
  try{
  const ObjectWeather = {};
  const  weatherLocation = await obJectLocation;
  console.log(weatherLocation);
  const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${weatherLocation.lat}&lon=${weatherLocation.lon}&appid=${WEATHER_API_KEY}`;
  console.log(WEATHER_URL);
  const response = await fetch(WEATHER_URL);
  if(response.status !==200)
  {
    document.location.href = redirectUrl
  }
  const weatherData = await response.json();
  console.log(weatherData);
  ObjectWeather.weather = weatherData.weather[0].description;
  ObjectWeather.temp = weatherData.main.temp;
  ObjectWeather.humidity = weatherData.main.humidity;
  ObjectWeather.wind_speed = weatherData.wind.speed;
  ObjectWeather.icon = weatherData.weather[0].icon;
  ObjectWeather.locationName = weatherLocation.locationName + ' ' + weatherData.sys.country;
  return ObjectWeather;
  }
  catch(error){
    console.error(error);
    return null;
  }
  
 }
  

//  (async () => {
//  console.log((await GETWEATHER(GETGEOLocation('sunnyvale'))).locationName);
// //  $(".2").text((await GETWEATHER(GETGEOLocation('sunnyvale'))).locationName);
// // // weatherDetails.childen[0].text((await GETWEATHER(GETGEOLocation('sunnyvale'))).weather);
// // console.log(weatherDetails.children[0])
// // weatherDetails.children[0].textContent = (await GETWEATHER(GETGEOLocation('sunnyvale'))).locationName;


// })();

async function displayWeather(placeName){
  const displayWeatherObject = await GETWEATHER(GETGEOLocation(placeName));
  console.log(displayWeatherObject);
  const tempF = Math.round((displayWeatherObject.temp - 273.15) * 9/5 + 32);
  console.log(tempF);
  const arrayWeatherDisPlay = [displayWeatherObject.locationName, `Temp: ${tempF}°F`, 
                              `Wind: ${displayWeatherObject.wind_speed} MPH`, 
                              `Humidity: ${displayWeatherObject.humidity}%`,
                              `Condition: ${displayWeatherObject.weather}`];

  for(let i =0; i<weatherDetails.children.length; i++){

    weatherDetails.children[i].textContent = arrayWeatherDisPlay[i];
  }
  //  weatherDetails.children[0].textContent = displayLocationName.locationName;
  //  weatherDetails.children[1].textContent = `Temp: ${tempF}°F`;
  //  weatherDetails.children[2].textContent = `Wind: ${displayWeatherObject.wind_speed} MPH`;
  //  weatherDetails.children[3].textContent = `Humidity: ${displayWeatherObject.humidity}%`;  
  //console.log((await GETWEATHER(GETGEOLocation(placeName))).icon);

  //This demonstrates how to use bootstrap to display the weather icon
// $(".weather-icon img").attr(
//   "src",
//    `assets/img/${displayWeatherObject.icon}.webp`
// );
$(".weather-icon h3").text(displayWeatherObject.weather);
$(".weather-data").css("background-image", `url(assets/img/${displayWeatherObject.icon}.webp)`);
//$(".weather-data").css("background-size", "75% auto");
$(".weather-data").css("background-size", "100%");
$(".weather-data").css("background-repeat", "no-repeat");
$(".weather-data").css("background-position", "right");

getWeatherHistory();

}


function handleSearchBtnClick(event){
  event.preventDefault();

  displayWeather(searchInput.value);
  searchInput.value = "";
}


function getWeatherHistory()
{
  $(".list-group").empty();
 
let RetrievedObject_cityList = JSON.parse(localStorage.getItem('cityListObject'));
if(RetrievedObject_cityList !== null)
{
  for(let i =0; i<RetrievedObject_cityList.length; i++)
  {
    console.log(RetrievedObject_cityList[i].locationName);
    let listCity = document.createElement('li');
    let button = document.createElement('button');
    let removeCity = document.createElement('button');
    button.textContent = RetrievedObject_cityList[i].locationName; 
    removeCity.textContent = 'Remove';        
    button.setAttribute('class', 'btn btn-primary');
    button.setAttribute('type', 'button');
    button.setAttribute('id', 'butt'+i);
    removeCity.setAttribute('class', 'btn btn-danger');
    removeCity.setAttribute('type', 'button');
    removeCity.setAttribute('id', 'removeButt'+i);
    // removeCity.addEventListener('click', function(){
    //   RetrievedObject_cityList.splice(i, 1);
    //   localStorage.setItem('cityListObject', JSON.stringify(RetrievedObject_cityList));
    //   getWeatherHistory();
    // });
  
    $(".list-group").append(document.createElement('br')); 
    $(".list-group").append(listCity);  
    listCity.append(button);
    button.append(removeCity);

    
 
  }



  // for(let i =0; i<RetrievedObject_cityList.length; i++)
  // {
  //   document.getElementById('butt'+i).addEventListener('click', function(){
  //     displayWeather(RetrievedObject_cityList[i].locationName);
  //   });

   

  //   document.getElementById('removeButt'+i).addEventListener('click', function(){
  //     RetrievedObject_cityList.splice(i, 1);
  //     localStorage.setItem('cityListObject', JSON.stringify(RetrievedObject_cityList));
  //     getWeatherHistory();
  //   });
    
  // }

}
//clearHistory();
 
}



function clearHistory(){

  let clearButton = document.createElement('button');
  clearButton.textContent = 'Clear History';
  clearButton.setAttribute('class', 'btn btn-primary');
  clearButton.setAttribute('type', 'button');
  $(".list-group").append(document.createElement('br'));
  $(".list-group").append(clearButton);

    clearButton.addEventListener('click', function(){
    localStorage.removeItem('cityListObject');
    $(".list-group").empty();
  });


}




function init ()
{
  getWeatherHistory();
  searchBtn.addEventListener("click", handleSearchBtnClick);

  
}


init();