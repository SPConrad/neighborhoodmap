///to be replaced by proper Google Maps Places objects
var favoritePlaces = [
	{
		name: 'Space Needle',
		street: '400 Broad St',
		lat: 47.620412,
		lng: -122.349277,
		city: 'Seattle'
	},
	{
		name: 'Gas Works Park',		
		lat: 47.654941,
		lng: -122.335205,
		street: '2101 N Northlake Way',
		city: 'Seattle'
	},
	{
		name: 'Farmers\' Market West Seattle',
		lat: 47.56116,
		lng: -122.386807,
		street: 'California Ave SW and SW Alaska St',
		city: 'Seattle'
	},
	{
		name: 'Volunteer Park',
		lat: 47.630056,
		lng: -122.314932,
		street: '1247 15th Ave E',
		city: 'Seattle'
	},
	{
		name: 'Seward Park',
		lat: 47.55067,
		lng: -122.256290,
		street: '5900 Lake Washington Blvd S',
		city: 'Seattle'
	}
]

var placesTypes = [{ 'key': 'accounting'}, { 'key': 'airport'}, { 'key': 'amusement_park'}, { 'key': 'aquarium'}, { 'key': 'art_gallery'}, { 'key': 'atm'}, { 'key': 'bakery'}, { 'key': 'bank'}, { 'key': 'bar'}, { 'key': 'beauty_salon'}, { 'key': 'bicycle_store'}, { 'key': 'book_store'}, { 'key': 'bowling_alley'}, { 'key': 'bus_station'}, { 'key': 'cafe'}, { 'key': 'campground'}, { 'key': 'car_dealer'}, { 'key': 'car_rental'}, { 'key': 'car_repair'}, { 'key': 'car_wash'}, { 'key': 'casino'}, { 'key': 'cemetery'}, { 'key': 'church'}, { 'key': 'city_hall'}, { 'key': 'clothing_store'}, { 'key': 'convenience_store'}, { 'key': 'courthouse'}, { 'key': 'dentist'}, { 'key': 'department_store'}, { 'key': 'doctor'}, { 'key': 'electrician'}, { 'key': 'electronics_store'}, { 'key': 'embassy'}, { 'key': 'fire_station'}, { 'key': 'florist'}, { 'key': 'funeral_home'}, { 'key': 'furniture_store'}, { 'key': 'gas_station'}, { 'key': 'gym'}, { 'key': 'hair_care'}, { 'key': 'hardware_store'}, { 'key': 'hindu_temple'}, { 'key': 'home_goods_store'}, { 'key': 'hospital'}, { 'key': 'insurance_agency'}, { 'key': 'jewelry_store'}, { 'key': 'laundry'}, { 'key': 'lawyer'}, { 'key': 'library'}, { 'key': 'liquor_store'}, { 'key': 'local_government_office'}, { 'key': 'locksmith'}, { 'key': 'lodging'}, { 'key': 'meal_delivery'}, { 'key': 'meal_takeaway'}, { 'key': 'mosque'}, { 'key': 'movie_rental'}, { 'key': 'movie_theater'}, { 'key': 'moving_company'}, { 'key': 'museum'}, { 'key': 'night_club'}, { 'key': 'painter'}, { 'key': 'park'}, { 'key': 'parking'}, { 'key': 'pet_store'}, { 'key': 'pharmacy'}, { 'key': 'physiotherapist'}, { 'key': 'plumber'}, { 'key': 'police'}, { 'key': 'post_office'}, { 'key': 'real_estate_agency'}, { 'key': 'restaurant'}, { 'key': 'roofing_contractor'}, { 'key': 'rv_park'}, { 'key': 'school'}, { 'key': 'shoe_store'}, { 'key': 'shopping_mall'}, { 'key': 'spa'}, { 'key': 'stadium'}, { 'key': 'storage'}, { 'key': 'store'}, { 'key': 'subway_station'}, { 'key': 'synagogue'}, { 'key': 'taxi_stand'}, { 'key': 'train_station'}, { 'key': 'transit_station'}, { 'key': 'travel_agency'}, { 'key': 'university'}, { 'key': 'veterinary_care'}, { 'key': 'zoo'}];

var loadFile= function(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'js/weatherCodes.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

var getWindDirection = function(bearing){
	var windBearing = bearing;
	switch (true) {
		case (windBearing > 0 && windBearing <= 11.25):
			return "Northerly";
			break;
		case (windBearing > 11.25 && windBearing <= 35.75):
			return "North North Easterly";
			break;
		case (windBearing > 35.75 && windBearing <= 56.25):
			return "North Easterly";
			break;
		case (windBearing > 56.25 && windBearing <= 78.75):
			return "East North Easterly";
			break;
		case (windBearing > 78.75 && windBearing <= 101.25):
			return "Easterly";
			break;
		case (windBearing > 101.25 && windBearing <= 123.75):
			return "East South Easterly";
			break;
		case (windBearing > 123.75 && windBearing <= 146.25):
			return "South Eastrly";
			break;
		case (windBearing > 146.25 && windBearing <= 168.75):
			return "South South Easterly";
			break;
		case (windBearing > 168.75 && windBearing <= 191.25):
			return "Southerly";
			break;
		case (windBearing > 191.25 && windBearing <= 213.75):
			return "South South Westerly";
			break;
		case (windBearing > 213.75 && windBearing <= 236.75):
			return "South Westerly";
			break;
		case (windBearing > 236.75 && windBearing <= 258.75):
			return "West South Westerly";
			break;
		case (windBearing > 258.75 && windBearing <= 281.25):
			return "Westerly";
			break;
		case (windBearing > 281.25 && windBearing <= 303.75):
			return "West North Westerly";
			break;
		case (windBearing > 303.75 && windBearing <= 326.25):
			return "North Westerly";
			break;
		case (windBearing > 326.25 && windBearing <= 348.75):
			return "North North Westerly";
			break;
		case (windBearing > 348.75 && windBearing <= 0):
			return "Northerly";
			break;
			
	}
}


var initLocations = function(array){
	var bufferArray = ko.observableArray([]);

	var index = 0;

	array.forEach(function(location) {
		location.index = index++;
		bufferArray().push(new Place(location));
	});

	return bufferArray();
}

var Model = function () {

	var self = this;

    this.defaultLocations = initLocations(favoritePlaces);
    this.nearbyVisible = ko.observable(false);
    this.nearbyList = initLocations(favoritePlaces);
    this.placesTypes = ko.observableArray(placesTypes);
    console.log(this.placesTypes);


    this.currentPlace = this.defaultLocations[0];
    this.currentWeather = ko.observable();
    this.weatherForecast = ko.observableArray(); 
    
    this.weatherCodes = ko.observable();

    loadFile(function(response){
    	var parsedResponse = JSON.parse(response);
    	self.weatherCodes(parsedResponse);
    })

};

var Place = function(data) {
	var self = this; 

	var state = 'WA'
	var lat = data.geometry ? data.geometry.location.lat() : data.lat;
	var lng = data.geometry ? data.geometry.location.lng() : data.lng;

	this.index = ko.observable(data.index);
	this.name = ko.observable(data.name);
	this.lat = ko.observable(lat);
	this.lng = ko.observable(lng);
	this.street = ko.observable(data.street);
	this.city = ko.observable(data.city);
	this.state = ko.observable(state);

	this.priceLevel = ko.observable(data.price_level);

	this.priceText = ko.computed(function(){
		var text = "$";	
		if(typeof(self.priceLevel()) === 'number'){
			return text.repeat(self.priceLevel());
		} else {
			return "";
		}
	})
	this.ratings = ko.observable(data.rating); 
	this.types = ko.observableArray(data.types);
	this.type = ko.observable(data.types ? data.types[0] : "none");

	this.address = ko.computed(function() { 
		return self.street() + ", " + self. city() + ", " + self.state() 
	});
	this.requestAddress = ko.computed(function() {
		return self.address().replace(/ /g, "+")
	});

	this.nearbyPlacesHTML = ko.observable('<button type="button" class="btn btn-info" data-toggle="collapse" data-target="#nearby-places">Button</button><div class="collapse" id="nearby-places"><li data-bind="text: rating"></li><li data-bind="text: priceLevel"></li><li data-bind="text: type"></li></div>')
}



var ViewModel = function() {

	///to avoid any confusion later
	var self = this;

	this.model = new Model(); 

	this.nearbyPlacesList = ko.observableArray([]);

	this.placesList = ko.computed(function() {
		return self.model.defaultLocations;
	}, this);




	this.currentPlace = ko.observable(self.model.defaultLocations[0]);

	this.hasCurrentPlace = true; 


	this.logPlaces = function(){
		console.log(self.nearbyPlacesList().length);
		//this.nearbyPlacesList().forEach(function(place){
		//	console.log(place.name());
		//})
	};

	this.createPlace = function(defaultLocations) {
		var index = 0;
		defaultLocations.forEach(function(place){
			place.index = index++;
			self.model.defaultLocations.push(new Place(place)); 
		});
	};

	this.nearbyPlacesVisible = ko.computed(function(){
    	return self.model.nearbyVisible();
    })

    this.clearPlaces = function(){
    	self.nearbyPlacesList([]);
    }

	this.changeNearbyPlaces = function(nearbyPlaces){
		self.nearbyPlacesList([]);

		nearbyPlaces.forEach(function(place){
			self.nearbyPlacesList.push(new Place(place));
		});

		
		self.model.nearbyVisible(true);

		var nearbyItem = document.getElementById("nearby-places-item")
		//nearbyItem.className = "collapse('show')";
	};

	this.setCurrentPlace = function(location){
		self.currentPlace(self.model.defaultLocations[location.index()]);
		console.log(self.currentPlace().name());
	}


	this.setCurrentWeather = function(weather){
		weather.readableCondition = self.weatherCodes()[weather.weather[0].id].label;
		weather.readableWindDirection = getWindDirection(weather.wind.deg);
		self.model.currentWeather(weather);
	}

	this.currentWeather = ko.computed(function() {
		return self.model.currentWeather();
	})

	this.weatherCodes = ko.computed(function() {
		return self.model.weatherCodes(); 
	})

	this.placesTypes = ko.computed(function() {
		return self.model.placesTypes();
	})

}

var viewModel = new ViewModel();

ko.applyBindings(viewModel);
