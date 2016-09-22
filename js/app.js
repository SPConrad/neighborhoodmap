///Sean Conrad Udacity Front End Neighborhood Map Project September 2016



///hardcoded favorite/default places
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
];

///readable place types for google maps places
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
];

var loadFile= function(callback) {   
	///get JSON file with readable weather codes
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'js/weatherCodes.json', true); 
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 };

///this was fun
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
};


///create an array of Place types with passed in array of non-Place types
var initLocations = function(array){
	var bufferArray = ko.observableArray([]);

	var index = 0;

	array.forEach(function(location) {
		location.index = index++;
		bufferArray().push(new Place(location));
	});

	return bufferArray();
};

var Model = function () {

	///set up the Model
	var self = this;

    this.defaultLocations = initLocations(favoritePlaces);
    this.nearbyVisible = ko.observable(false);
    this.nearbyList = self.defaultLocations;
    this.placesTypes = ko.observableArray(placesTypes);
    this.currentPlace = this.defaultLocations[0];
    this.currentNearbyPlace = ko.observable();
    this.currentWeather = ko.observable();
    this.weatherForecast = ko.observableArray(); 
    this.weatherCodes = ko.observable();

    loadFile(function(response){
    	var parsedResponse = JSON.parse(response);
    	self.weatherCodes(parsedResponse);
    });

};

///a Place variable
var Place = function(data) {
	var self = this; 
	///they'll all be in WA for this demo
	var state = 'WA';
	///if there is a data.geometry, get the lat and lng from there. otherwise use what is passed in
	var lat = data.geometry ? data.geometry.location.lat : data.lat;
	var lng = data.geometry ? data.geometry.location.lng : data.lng;

	this.index = data.index;
	this.longName = data.name;
	var spacesInName = [];
	for (var i = 0; i < this.longName.length; i++){
		if (this.longName[i] === " "){
			spacesInName.push(i);
		}
	}

	console.log(spacesInName.length);

	if (spacesInName.length > 2){
		this.name = this.longName.slice(0, spacesInName[2]) + "... ";
	} else {
		this.name = this.longName;
	}
	this.lat = lat;
	this.lng = lng;
	this.street = data.street;
	this.city = data.city;
	this.state = state;

	this.priceLevel = data.price_level;
	///make a readable price variable 
	this.priceText = ""; 
	var text = "$";
	if(typeof(self.priceLevel === 'number')){
		self.priceText = text.repeat(self.priceLevel);
	} 
	this.ratings = data.rating; 
	this.types = data.types;
	this.type = data.types ? data.types[0] : "none";
	///make an easily used address object
	this.address = self.street + ", " + self.city + ", " + self.state;
	///make an address object for use in requests 

	this.requestAddress = self.address.replace(/ /g, "+");

	///css trickery for smaller browsers
	this.cssClass = ko.observable("show");

	this.hidden = false;

};



var ViewModel = function() {

	///to avoid any confusion later
	var self = this;

	this.model = new Model(); 

	///intialize nearbyPlacesList array
	this.nearbyPlacesList = ko.observableArray([]);

	this.currentPlace = ko.observable(-1);

	this.filterString = ko.observable("");

	this.selectedPlaceType = ko.observable();

	this.currentWeather = ko.computed(function() {
		return self.model.currentWeather();
	});

	this.weatherCodes = ko.computed(function() {
		return self.model.weatherCodes(); 
	});

	this.placesTypes = ko.computed(function() {
		return self.model.placesTypes();
	});

	this.placesList = ko.computed(function() {
		return self.model.defaultLocations;
	});

	/*this.assignDefaultHyperlinks = function(){
			self.model.defaultLocations.forEach(function(location){
			location.clickLink = document.getElementById('favorite-place-' + location.index());
			location.clickLink.onclick = function(){
				console.log(location.name());
			}
		})
	}*/

	this.placeType = ko.computed(function() {
		return self.selectedPlaceType();
	});

	//this.searchString = ko.observable("");
	this.filterStringLength = ko.computed(function(){
		return self.filterString().length;
	});


	this.getCurrentPlace = ko.computed(function(){
		if (self.currentPlace() == -1){
			return -1;
		} else {
			return self.currentPlace().index;
		}
	});

	this.nearbyPlacesVisible = ko.computed(function(){
    	return self.model.nearbyVisible();
    });

	this.selectedNearbyPlace = ko.computed(function(){
		return self.model.currentNearbyPlace();
	});	

    this.setCurrentNearbyPlace = function(location){
    	self.model.currentNearbyPlace(self.nearbyPlacesList()[location.index]);
    	console.log(self.model.currentNearbyPlace());
    };

	this.setCurrentPlace = function(location){
		///assign the currentPlace
		if (location === 'null'){
			///if there is no location in the variable, reset the css on the filter text box 
			///so it will be shown on small windows
			document.getElementById('search-text').className="";
			///show all of the other default places
			self.changeCSS("show");
			self.currentPlace(-1);
		} else {
			///if there is, hide the text box
			document.getElementById('search-text').className="hide-when-small";
			///hide the other default places
			self.changeCSS("hide-when-small");			
			///show the selected default place
			self.model.defaultLocations[location.index].cssClass("show current-place");
			self.currentPlace(self.model.defaultLocations[location.index]);
		}
	};

	this.changeCSS = function(newCSS){
		self.model.defaultLocations.forEach(function(location){
			location.cssClass(newCSS);
		});
	};

	this.changeNearbyCSS = function(index, newCSS){
		//self.nearbyPlacesList()[index].cssClass(newCSS);
		document.getElementById('nearby-parent-' + index).className = newCSS;
		//console.log(self.nearbyPlacesList()[index].cssClass());
	};

	this.searchPlaces = function(){
		self.clearPlaces();
		gMap.searchPlacesByType(self.currentPlace(), self.placeType.key);
	};

	this.showDefault = function(index){
		if (self.filterStringLength() > 0){
			//var lowerString = self.filterString.toLowerCase();
			if(self.model.defaultLocations[index].name.toLowerCase().includes(self.filterString().toLowerCase())){
				if (self.model.defaultLocations[index].hidden() === true){
					self.model.defaultLocations[index].hidden = false;
					gMap.changeDefault(index, "show");
				}
				return true;
			} else{
				if (self.model.defaultLocations[index].hidden === false)
				{
					self.model.defaultLocations[index].hidden = true;
					gMap.changeDefault(index, "hide");
				}
				return false;
			}
		} else {
			self.model.defaultLocations.forEach(function(location){
				if (location.hidden === true){
					gMap.changeDefault(location.index, "show");
					location.hidden = false ;
				}
			});
			return true;
		}
	};


    this.clearPlaces = function(){
    	///clear out the nearbyPlacesList array
    	if (self.nearbyPlacesList().length > 0){
    		self.nearbyPlacesList.removeAll();
		}
    };

    /*this.movePlaceToTop = function(index){
    	var bufferPlace = new self.nearbyPlacesList()[index];
    	//self.nearbyPlacesList()[0] = self.nearbyPlacesList()[index];
    	//self.nearbyPlacesList()[index] = bufferPlace;
    	console.log(bufferPlace);
    	self.nearbyPlacesList.remove(self.nearbyPlacesList()[index]);
    	self.nearbyPlacesList.unshift(bufferPlace);
    	console.log(self.nearbyPlacesList());
    }*/

	this.changeNearbyPlaces = function(nearbyPlaces){
		var self = this;

		nearbyPlaces.forEach(function(place){
			self.nearbyPlacesList.push(new Place(place));
		});


		///tell view that nearbyPlaces should be shown
		self.model.nearbyVisible(true);
	};

	this.setCurrentWeather = function(weather){
		weather.readableWindDirection = getWindDirection(weather.windBearing);
		self.model.currentWeather(weather);
	};
};

var viewModel = new ViewModel();

ko.applyBindings(viewModel);


