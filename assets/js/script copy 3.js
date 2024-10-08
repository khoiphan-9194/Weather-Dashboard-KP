
let currentDate = dayjs().format("MMM-DD-YYYY");
const WEATHER_API_KEY = "313e19582894eb8e201b929fa986e291";
const GEOTOMTOM_API_KEY = "fEpXmh3qP1JYzUnM3EIZjqSnqkCkvAPk";
var redirectUrl = './404.html';
let weatherDetails = document.querySelector(".weather-detail");
let searchBtn = document.querySelector(".search-btn");
let searchInput = document.querySelector(".city-input");
let clearBtn = document.querySelector(".clear-btn");
let cityList = [];
let butt_arr = [];

//http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}


async function GETGEOLocation (locationName){
  try{
    var ObjectLocation={};
var GeolocationName = locationName.trim().replaceAll(/\s+/g, '&');
var locationTOMTOM =`https://api.tomtom.com/search/2/geocode/${GeolocationName}.json?key=${GEOTOMTOM_API_KEY}&limit=1`
//var locationTOMTOM =`http://api.openweathermap.org/geo/1.0/direct?q=${GeolocationName}&limit=5&appid=${WEATHER_API_KEY}`

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
// cityList.forEach((city) => {
//   city.pop();
// }
// );







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
  return ObjectWeather; // return the object weather
  }
  catch(error){
    console.error(error);
    return null;
  }
  
 }
  



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

$(".weather-icon h3").text(displayWeatherObject.weather);
$(".weather-data").css("background-image", `url(assets/img/${displayWeatherObject.icon}.webp)`);
//$(".weather-data").css("background-size", "75% auto");
$(".weather-data").css("background-size", "100%");
$(".weather-data").css("background-repeat", "no-repeat");
$(".weather-data").css("background-position", "right");

//await getWeatherHistory();

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
if(RetrievedObject_cityList === null)
{
  return;
}
  for(let i =0; i<RetrievedObject_cityList.length; i++)
  {
   // console.log(RetrievedObject_cityList[i].locationName+' '+i);
    let listCity = document.createElement('li');
    let button = document.createElement('button');
    let removeCity = document.createElement('button');
    button.textContent = RetrievedObject_cityList[i].locationName; 
    removeCity.textContent = '❌';  
    button.setAttribute('class', 'btn btn-primary');
    button.setAttribute('id', 'butt'+i);
    removeCity.setAttribute('class', 'btn btn-danger');
    removeCity.setAttribute('id', 'removeButt'+i);
    $(".list-group").append(document.createElement('br')); 
    $(".list-group").append(listCity);  
    listCity.appendChild(button);
    button.appendChild(removeCity);
    
    
 
  
    await displayWeatherHistory();
  //  await removeWeatherHistory();
}
 
}


async function removeWeatherHistory(){
  let RemoveSpecificItem = await JSON.parse(localStorage.getItem('cityListObject'));
  for(let i =0; i<RemoveSpecificItem.length; i++)
  {
      document.getElementById('removeButt'+i).addEventListener('click', async function(){
      if(RemoveSpecificItem.length === 1)
      {
        localStorage.clear("cityListObject");
        $(".list-group").empty();
        cityList = [];
        butt_arr = [];
        console.log(cityList);
        console.log(butt_arr);
        alert('All history has been cleared');
        return;
      }
    RemoveSpecificItem.splice(i, 1);
    localStorage.setItem('cityListObject', JSON.stringify(RemoveSpecificItem)); // update the local storage
    await getWeatherHistory();

    // cityList.splice(i, i+1);
    // butt_arr.splice(i, i+1);
    // RemoveSpecificItem.splice(i, i+1);
    // localStorage.setItem('cityListObject', JSON.stringify(cityList)); // update the local storage
    // console.log(RemoveSpecificItem);
    // await getWeatherHistory();
    });
  }
}

async function displayWeatherHistory(){
  let Display_cityList = await JSON.parse(localStorage.getItem('cityListObject'));
  for(let i =0; i<Display_cityList.length; i++)
  {
    console.log(Display_cityList[i].locationName);
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
  await getWeatherHistory();
}



 init();
 //searchBtn.addEventListener("click", await handleSearchBtnClick);
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
  console.log(cityList);
  console.log(butt_arr);
  alert('All history has been cleared');

 });





