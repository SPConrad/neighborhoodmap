///Sean Conrad Udacity Front End Neighborhood Map Project September 2016


var weatherApiUrlBase = "http://api.openweathermap.org/data/2.5/";

var currentWeatherUrl = "weather?";

var weatherApiKey = "&appid=8b0e79fa0a446292795b755997601af7";

var forecastURL = "forecast?q=";


var Weather = function() {

	var self = this;

	///function to get the forecast by city
	self.forecastCity = function(location) {
		return forecastByCity(location);
	};
	///function to get current weather by latLng
	self.currentLatLngWeather = function(location) {
		return currentWeatherByCoord(location); 
	};
};

function httpRequest(url, callback)
{
	///create request var
    var xhr = new XMLHttpRequest();

    ///send the request
    xhr.open('GET', url, true);
    xhr.send();

    ///listen for the response
    xhr.addEventListener("readystatechange", callback, false);
}

function forecastByCity(location){
	///generate a url for the request
	var url = weatherApiUrlBase + forecastURL + location.city() + "," + location.state() + weatherApiKey;

	///fire request
	httpRequest(url, function(response) {
		if (response.target.readyState === 4 && response.target.status === 200){
			///if the request comes back ready and with a 200

			///assign weatherData
			var weatherData = response.target.responseText;
			///parse it (I dislike assigning and parsing at the same time)
			var formattedWeatherData = JSON.parse(weatherData);

			///create empty forecasts arrray
			var forecasts = [];
			///limit to three forecasts
			var numOfForecasts = 3;

			///assign forecasts array
			for (var i = 0; i < numOfForecasts; i++){
				forecasts.push(formattedWeatherData.list[i]);
			}

			///make a readable date for each one
			forecasts.forEach(function(forecast){
				var date = new Date(0);
				date.setUTCSeconds(forecast.dt);
				//console.log(date);
			});


		}

	});
}

function currentWeatherByCoord(location) {
	///generate a request url
	var url = weatherApiUrlBase + currentWeatherUrl + 'lat=' + location.lat() + '&lon=' + location.lng() + weatherApiKey;
	///fire request
	httpRequest(url, function(response) {
		if (response.target.readyState === 4 && response.target.status === 200){
			///if request comes back ready and with a 200

			///assign weatherdata 
			var weatherData = response.target.responseText;
			///parse it
			var formattedWeatherData = JSON.parse(weatherData);

			///temp comes back in kelvin
			var kelvTemp = formattedWeatherData.main.temp;
			///create a temp in F for us stupid americans 
			formattedWeatherData.tempInFar = kelvTemp * (9/5) - 459.67; 
			formattedWeatherData.tempInFar = formattedWeatherData.tempInFar.toFixed(0);

			///send off the weatherdata to the viewmodel
			viewModel.setCurrentWeather(formattedWeatherData);

			}

	});
}

var weather = new Weather();