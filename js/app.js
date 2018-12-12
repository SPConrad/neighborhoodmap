///Sean Conrad Rain Delay prototype

///hardcoded favorite/default places
var favoritePlaces = [
	{
		postal_code : 98106
	}
];



///this was fun
var getWindDirection = function(bearing){
	var windBearing = bearing;
	switch (true) {
		case (windBearing > 0 && windBearing <= 11.25):
			return "Northerly";
		case (windBearing > 11.25 && windBearing <= 35.75):
			return "North North Easterly";			
		case (windBearing > 35.75 && windBearing <= 56.25):
			return "North Easterly";			
		case (windBearing > 56.25 && windBearing <= 78.75):
			return "East North Easterly";			
		case (windBearing > 78.75 && windBearing <= 101.25):
			return "Easterly";			
		case (windBearing > 101.25 && windBearing <= 123.75):
			return "East South Easterly";			
		case (windBearing > 123.75 && windBearing <= 146.25):
			return "South Eastrly";			
		case (windBearing > 146.25 && windBearing <= 168.75):
			return "South South Easterly";			
		case (windBearing > 168.75 && windBearing <= 191.25):
			return "Southerly";			
		case (windBearing > 191.25 && windBearing <= 213.75):
			return "South South Westerly";			
		case (windBearing > 213.75 && windBearing <= 236.75):
			return "South Westerly";			
		case (windBearing > 236.75 && windBearing <= 258.75):
			return "West South Westerly";			
		case (windBearing > 258.75 && windBearing <= 281.25):
			return "Westerly";			
		case (windBearing > 281.25 && windBearing <= 303.75):
			return "West North Westerly";			
		case (windBearing > 303.75 && windBearing <= 326.25):
			return "North Westerly";			
		case (windBearing > 326.25 && windBearing <= 348.75):
			return "North North Westerly";			
		case (windBearing > 348.75 && windBearing <= 0):
			return "Northerly";			
	}
};


var Model = function () {

	///set up the Model
	var self = this;

    self.nearbyPlaces = ko.observableArray();
    self.userAddresses = ko.observableArray();
	self.weather = ko.observable();
	self.zipcode = ko.observable("27704");
};

var ViewModel = function() {

	///to avoid any confusion later
	var self = this;

	self.model = new Model(); 

	self.currentPlace = ko.observable(-1);

	self.selectedPlaceType = ko.observable();

	self.zipcode = ko.computed(function(){
		return self.model.zipcode();
	})

	self.weather = ko.computed(function() {
		return self.model.weather();
	});

	self.placesList = ko.computed(function() {
		return self.model.defaultLocations;
	});

	self.userAddresses = ko.computed(function(){
		return self.model.userAddresses();
	});


    self.clearPlaces = function(){
    	///clear out the nearbyPlaces array
    	if (self.model.nearbyPlaces().length > 0){
    		self.model.nearbyPlaces.removeAll();
		}
	};
	
	self.getWeather = function(){
		console.log("set current weather")
		gMap.makeGeoCodeCall(self.model.zipcode());
	}
    /*loadFile(function(response){
    	var parsedResponse = JSON.parse(response);
    	self.weatherCodes(parsedResponse);
    });*/
	self.setCurrentWeather = function(newWeather){
		newWeather = JSON.parse(newWeather)
		newWeather.readableWindDirection = getWindDirection(newWeather.currently.windBearing);
		console.log(newWeather);
		self.model.weather(newWeather);

	};
};
var viewModel = new ViewModel();

ko.applyBindings(viewModel);