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
fetch(locationTOM).then(function (response) {
  // Use a conditional to check the response status.
  // If that status equals the conditional, then redirect to the 404 page.
  if(response.status !==200)
  {
    document.location.href = redirectUrl
  }
  return response.json();
})
.then(function (data) {
  console.log(data);
  console.log(data.results[0].position.lat);
});


//https://{baseURL}/search/{versionNumber}/geocode/{query}.{ext}?key={Your_API_Key}&limit={limit}&countrySet={countrySet}

//fEpXmh3qP1JYzUnM3EIZjqSnqkCkvAPk



