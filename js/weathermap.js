///Sean Conrad Udacity Front End Neighborhood Map Project September 2016

var darkSkyURLBase = "https://api.darksky.net/forecast/";

var darkSkyApiKey = "c97014d507a24972e9fd2ee5940ab16a/";

var Weather = function() {

	var self = this;

	///function to get current weather by latLng
	self.currentLatLngWeather = function(location) {
		forecastByCoord(location); 
	};
};


function forecastByCoord(location) {
	///generate a request url
	var weatherURL = darkSkyURLBase + darkSkyApiKey + location.lat + "," + location.lng;
	//var url = weatherApiUrlBase + currentWeatherUrl + 'lat=' + location.lat() + '&lon=' + location.lng() + weatherApiKey;
	///fire request

	var request = $.ajax({
		url: weatherURL,
		dataType: "jsonp",
		timeout: 2000
	});

	request.done(function(data){
			viewModel.setCurrentWeather(data);
	});

	request.fail(function(data){
		alert("Weather call failed, sorry about that");
	});
}

var weather = new Weather();