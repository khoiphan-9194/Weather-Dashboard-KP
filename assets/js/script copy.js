// var badRequestUrl = 'https://api.github.com/unicorns';


// fetch(badRequestUrl).then(function (response) {
//   // Use a conditional to check the response status.
//   // If that status equals the conditional, then redirect to the 404 page.
//   if(response.status !==200)
//   {
//     document.location.href = redirectUrl
//   }
//   return response.json();
// });

// const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtitude}&appid=${API_KEY}`;
//   fetch(WEATHER_URL)

let currentDate = dayjs().format("MMM-DD-YYYY");
const WEATHER_API_KEY = "313e19582894eb8e201b929fa986e291";
const GEOTOMTOM_API_KEY = "fEpXmh3qP1JYzUnM3EIZjqSnqkCkvAPk";
var redirectUrl = './404.html';

const cityList = [];
const butt_arr = [];

console.log("hello");

//https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=313e19582894eb8e201b929fa986e291
// function displayTimeDashBoard() {
//   var rightNow = dayjs().format("MMM DD, YYYY [at] hh:mm:ss a");
//   timeDisplayEl.text(rightNow);
//   setInterval(displayTimeDashBoard, 1000);
// }
// displayTimeDashBoard();
const WEATHERurl='https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=313e19582894eb8e201b929fa986e291'

const LOCATION ='http://api.openweathermap.org/geo/1.0/direct?q=san-francisco&limit=5&appid=313e19582894eb8e201b929fa986e291'
var locationTOM ='https://api.tomtom.com/search/2/geocode/ho&chi&minh.json?key=fEpXmh3qP1JYzUnM3EIZjqSnqkCkvAPk&limit=1'
// fetch(locationTOM).then(function (response) {
//   // Use a conditional to check the response status.
//   // If that status equals the conditional, then redirect to the 404 page.
//   if(response.status !==200)
//   {
//     document.location.href = redirectUrl
//   }
//   return response.json();
// })
// .then(function (data) {
//   console.log(data);
//   console.log(data.results[0].position.lat);

// });



function GETGEOLocation(locationName){
const ObjectLocation ={};
var GeolocationName = locationName.trim().replaceAll(/\s+/g, '&');
var locationTOMTOM =`https://api.tomtom.com/search/2/geocode/${GeolocationName}.json?key=${GEOTOMTOM_API_KEY}&limit=1`
console.log(locationTOMTOM);
fetch(locationTOMTOM)
.then(function (response) {
  // Use a conditional to check the response status.
  // If that status equals the conditional, then redirect to the 404 page.
  if(response.status !==200)
  {
    document.location.href = redirectUrl
  }
  return response.json();
})
.then(function (data) {

  // if(!data)
  //   // if the data is empty, then alert the user to re-check the input  
  // {
  //   return alert(`${GeolocationName} is invalid, please re-check the input`);
  // }
  console.log(data);
//  if(!data.results[0].address.includes(GeolocationName))
//   {
//     return alert(`${GeolocationName} is invalid, please re-check the input`); 
//   }

// if(!data.results.length)
// {
//   return alert(`${locationName} is invalid, please re-check the input`);
// }

// else
{

  // if(confirm(`Did you mean ${data.results[0].address.freeformAddress.split(', ')[0]}, ${data.results[0].address.countrySubdivision} 
  //   ${data.results[0].address.country} ?`) == false) // if the user click cancel, then alert the user to re-check the input
  // {
  //   console.log('cancel');
  //   return alert(`${locationName} is invalid, please re-check the input`); 
  // }
 
    ObjectLocation.locationName = data.results[0].address;
    ObjectLocation.lat = data.results[0].position.lat;
    ObjectLocation.lon = data.results[0].position.lon
    console.log(ObjectLocation);
    return ObjectLocation;
  
}
})
}





console.log(GETGEOLocation('ho chi minh'));




