///to be replaced by proper Google Maps Places objects
var favoritePlaces = [
	{
		name: 'Pike Place Market',
		street: '1517 Pike Place',
		lat: 47.6101,
		lng: -122.3421,
		city: 'Seattle'
	},
	{
		name: 'Centurylink Field',
		street: '800 Occidental Ave S',
		lat: 47.5952,
		lng: -122.3316,
		city: 'Seattle'
	},
	{
		name: 'Octo Sushi',
		street: '1621 12th Ave',
		lat: 47.6158559,
		lng: -122.3178045,
		city: 'Seattle'
	},
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

var placesTypes = [
	{
	    'key': 'restaurant', 
	    'name': 'Restaurants'
	},
	{    
		'key': 'airport', 
	    'name': 'Airports'
	},
	{
	    'key': 'aquarium', 
	    'name': 'Aquariums'
	},
	{
	    'key': 'art_gallery', 
	    'name': 'Art Galleries'
	},
	{ 
	    'key': 'atm', 
	    'name': 'ATMs'
	},
	{
	    'key': 'bakery', 
	    'name': 'Bakeries'
	},
	{
	    'key': 'bar',
	    'name': 'Bars'
	},
	{
	    'key': 'book_store', 
	    'name': 'Book Stores'
	},
	{
	    'key': 'bus_station', 
	    'name': 'Bus Stations'
	},
	{
	    'key': 'cafe', 
	    'name': 'Cafes'
	},
	{
	    'key': 'fire_station', 
	    'name': 'Fire Stations'
	},
	{
	    'key': 'hospital', 
	    'name': 'Hospitals'
	},
	{
	    'key': 'library', 
	    'name': 'Libraries'
	},
	{
	    'key': 'lodging', 
	    'name': 'Lodging'
	},
	{
	    'key': 'movie_theater', 
	    'name': 'Movie Theaters'
	},
	{
	    'key': 'museum', 
	    'name': 'Museums'
	},
	{
	    'key': 'park', 
	    'name': 'Parks'
	},
	{
	    'key': 'police', 
	    'name': 'Police Stations'
	},
	{
	    'key': 'post_office', 
	    'name': 'Post Offices'
	},
	{
	    'key': 'school', 
	    'name': 'Schools'
	},
	{
	    'key': 'stadium', 
	    'name': 'Stadia'
	},
	{
	    'key': 'subway_station', 
	    'name': 'Subway Stations'
	},
	{
	    'key': 'train_station', 
	    'name': 'Train Stations'
	},
	{
	    'key': 'veterinary_care', 
	    'name': 'Veterinary Offices'
	}
]

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
    this.nearbyList = self.defaultLocations;
    this.placesTypes = ko.observableArray(placesTypes);
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


	this.selectedPlaceType = ko.observable("");

	this.placeType = ko.computed(function() {
		return self.selectedPlaceType();
	})

	this.filterString = ko.observable("");
	//this.searchString = ko.observable("");
	this.filterStringLength = ko.computed(function(){
		return self.filterString().length;
	});

	this.currentPlace = ko.observable(-1);

	this.getCurrentPlace = ko.computed(function(){
		console.log('currentplace == "" = ' + (self.currentPlace() === -1));
		if (self.currentPlace() == -1){
			return -1;
		} else {
			console.log(self.currentPlace());
			return self.currentPlace().index();
		}
	});

	this.setCurrentPlace = function(location){
		console.log("location === null = " + (location === 'null'));
		if (location === 'null'){
			self.currentPlace(-1);
		} else {
			self.currentPlace(self.model.defaultLocations[location.index()]);
		}
	}


	this.hasCurrentPlace = true; 

	this.searchPlaces = function(){
		gMap.searchPlacesByType(self.currentPlace(), self.placeType().key);
	}

	this.showDefault = function(index){
		if (self.filterStringLength() > 0){
			if(self.model.defaultLocations[index()].name().includes(self.filterString())){
				return true;
			} else{
				return false;
			}
		} else {
			return true;
		}
	}

	this.createPlace = function(locations) {
		var index = 0;
		console.log("createPlace");
		locations.forEach(function(place){
			place.index = index++;
			self.model.defaultLocations.push(new Place(place)); 
		});
	};

	this.nearbyPlacesVisible = ko.computed(function(){
    	return self.model.nearbyVisible();
    })

    this.clearPlaces = function(){
    	console.log("clear places");

    	if (self.nearbyPlacesList().length > 0){
    		self.nearbyPlacesList.removeAll();
		}
    }

	this.changeNearbyPlaces = function(nearbyPlaces){
		var self = this;

		nearbyPlaces.forEach(function(place){
			self.nearbyPlacesList.push(new Place(place));
		});

		
		self.model.nearbyVisible(true);

		var nearbyItem = document.getElementById("nearby-places-item")
		//nearbyItem.className = "collapse('show')";
	};

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


