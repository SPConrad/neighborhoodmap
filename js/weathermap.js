var weatherApiUrlBase = "http://api.openweathermap.org/data/2.5/"

var currentWeatherUrl = "weather?"

var weatherApiKey = "&appid=8b0e79fa0a446292795b755997601af7"

var forecastURL = "forecast?q=";


var Weather = function() {

	var self = this;

	self.forecastCity = function(location) {
		return forecastByCity(location);
	}

	self.currentLatLngWeather = function(location) {
		return currentWeatherByCoord(location); 
	}
}

function httpRequest(url, callback)
{
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.send();

    /*xhr.onreadystatechange = function(){
    	if (xhr.readyState === 4 && xhr.status === 200){
    		callback(xhr.responseText);
    	}
    }*/

    xhr.addEventListener("readystatechange", callback, false);
}

function forecastByCity(location){
	var url = weatherApiUrlBase + forecastURL + location.city() + "," + location.state() + weatherApiKey;

	httpRequest(url, function(response) {
		if (response.target.readyState === 4 && response.target.status === 200){
			var weatherData = response.target.responseText;
			var formattedWeatherData = JSON.parse(weatherData);

			var forecasts = [];
			var numOfForecasts = 3;


			for (var i = 0; i < numOfForecasts; i++){
				forecasts.push(formattedWeatherData.list[i]);
			}

			forecasts.forEach(function(forecast){
				var date = new Date(0);
				date.setUTCSeconds(forecast.dt);
				//console.log(date);
			})


		}

	});
}

function currentWeatherByCoord(location) {
	var url = weatherApiUrlBase + currentWeatherUrl + 'lat=' + location.lat() + '&lon=' + location.lng() + weatherApiKey;

	httpRequest(url, function(response) {
		if (response.target.readyState === 4 && response.target.status === 200){
			var weatherData = response.target.responseText;
			var formattedWeatherData = JSON.parse(weatherData);



			}

	});
  /*if (response.getResponseCode() != 200) {
    throw Utilities.formatString(
        'Error returned by API: %s, Location searched: %s.',
        response.getContentText(), location);
  }

  var result = JSON.parse(response.getContentText());

  console.log(result);

  // OpenWeatherMap's way of returning errors.
  if (result.cod != 200) {
    throw Utilities.formatString(
        'Error returned by API: %s,  Location searched: %s.',
        response.getContentText(), location);
  }

  return result;*/
}

var weather = new Weather();