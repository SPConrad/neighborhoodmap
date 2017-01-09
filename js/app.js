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

///self was fun
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

    self.defaultLocations = initLocations(favoritePlaces);
    self.nearbyVisible = ko.observable(false);
    self.nearbyPlaces = ko.observableArray();
    self.placesTypes = ko.observableArray(placesTypes);
    self.currentPlace = self.defaultLocations[0];
    self.currentNearbyPlace = ko.observable();
    self.currentWeather = ko.observable();
    self.weatherForecast = ko.observableArray(); 
    self.weatherCodes = ko.observable();

    loadFile(function(response){
    	var parsedResponse = JSON.parse(response);
    	self.weatherCodes(parsedResponse);
    });

};

///a Place variable
var Place = function(data) {
	var self = this; 
	///they'll all be in WA for self demo
	var state = 'WA';
	///if there is a data.geometry, get the lat and lng from there. otherwise use what is passed in
	var lat = data.geometry ? data.geometry.location.lat : data.lat;
	var lng = data.geometry ? data.geometry.location.lng : data.lng;
	self.index = data.index;
	self.longName = data.name;
	var spacesInName = [];
	for (var i = 0; i < self.longName.length; i++){
		if (self.longName[i] === " "){
			spacesInName.push(i);
		}
	}
	if (spacesInName.length > 2){
		self.name = self.longName.slice(0, spacesInName[2]) + "... ";
	} else {
		self.name = self.longName;
	}
	self.lat = lat;
	self.lng = lng;
	self.street = data.street;
	self.city = data.city;
	self.state = state;

	self.priceLevel = data.price_level;
	///make a readable price variable 
	self.priceText = ""; 
	var text = "$";
	if(typeof(self.priceLevel === 'number')){
		self.priceText = text.repeat(self.priceLevel);
	}
	self.ratings = data.rating ? data.rating : "none"; 
	self.types = data.types;
	self.type = data.types ? data.types[0] : "none";
	///make an easily used address object
	self.address = self.street + ", " + self.city + ", " + self.state;
	///make an address object for use in requests 

	self.requestAddress = self.address.replace(/ /g, "+");

	///css trickery for smaller browsers
	self.cssClass = ko.observable("show");

	self.hidden = ko.observable(false);

	self.acceptedValue = ko.computed(function(){
		return self.hidden();
	});

	self.infoWindow = function(){
		var div = '<div id="info-window-content">' +
			'<span>' + self.name + '</span>' +
			'<ul id="info-window-list">';
			if (self.type != "none"){
				div +='<li id="type">' + self.type + '</li>'; 
			};
			if (self.ratings != "none"){
				div += '<li id="ratings">' + self.ratings + '</li>';
			};
			if (self.priceText != ""){
				div += '<li id="price">' + self.priceText + '</li>';
			};
			div += '</ul>' +
				'</div>';
			return div; 
	};

	self.marker = "";
};



var ViewModel = function() {

	///to avoid any confusion later
	var self = this;

	self.model = new Model(); 

	self.currentPlace = ko.observable(-1);

	self.newFilter = ko.observable("");

	self.getPlaceClickLink = function(index){
		if (document.getElementById('favorite-place-' + index) !== null){
			var clickLink = document.getElementById('favorite-place-' + index);
			clickLink.onclick = function(){
				gMap.setCurrentPlace(index);
				///self.setCurrentPlace(self.model.defaultLocations[index]);
			};
		}
	};

	self.filterString = ko.pureComputed({
		read: self.newFilter,
		write: function(value){
			///if there is anything in the filter
			if (value.length > 0){
				///go through each location
				self.model.defaultLocations.forEach(function(location){
					///if it matches what is in the string
					if(location.name.toLowerCase().includes(value.toLowerCase())){
						///don't hide it
						if (location.hidden() === true){
							location.hidden(false);
							gMap.changeDefault(location.index, "show");
							self.getPlaceClickLink(location.index);
						}
					} else {
						///if it doesn't match and isn't hidden
						if (location.hidden() === false){
							///hide it
							location.hidden(true);
							gMap.changeDefault(location.index, "hide");
						}
					}
				});
			} else {
				///if there's nothing in the filter
				self.model.defaultLocations.forEach(function(location){
					///don't hide anything
					location.hidden(false);
					gMap.changeDefault(location.index, "show");
					self.getPlaceClickLink(location.index);
				});
			}
		},
		owner: self
	});


	self.showDefault = function(index){
		if (self.filterStringLength() > 0){
			if(self.model.defaultLocations[index].name.toLowerCase().includes(self.filterString().toLowerCase())){
				if (self.model.defaultLocations[index].hidden === true){
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
					location.hidden = false;
				}
			});
			return true;
		}
	};

	self.selectedPlaceType = ko.observable();

	self.currentWeather = ko.computed(function() {
		return self.model.currentWeather();
	});

	self.weatherCodes = ko.computed(function() {
		return self.model.weatherCodes(); 
	});

	self.placesTypes = ko.computed(function() {
		return self.model.placesTypes();
	});

	self.placesList = ko.computed(function() {
		return self.model.defaultLocations;
	});

	self.placeType = ko.computed(function() {
		return self.selectedPlaceType();
	});

	//self.searchString = ko.observable("");
	self.filterStringLength = ko.computed(function(){
		return self.filterString().length;
	});

	self.getCurrentPlace = ko.computed(function(){
		if (self.currentPlace() == -1){
			return -1;
		} else {
			return self.currentPlace().index;
		}
	});

	self.nearbyPlacesVisible = ko.computed(function(){
    	return self.model.nearbyVisible();
    });

	self.selectedNearbyPlace = ko.computed(function(){
		return self.model.currentNearbyPlace();
	});	

    self.setCurrentNearbyPlace = function(index){
    	self.model.currentNearbyPlace(self.model.nearbyPlaces()[index]);
    };

	self.setCurrentPlace = function(location){
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

	self.changeCSS = function(newCSS){
		self.model.defaultLocations.forEach(function(location){
			location.cssClass(newCSS);
		});
	};

	self.changeNearbyCSS = function(index, newCSS){
		//self.model.nearbyPlaces()[index].cssClass(newCSS);
		document.getElementById('nearby-parent-' + index).className = newCSS;
	};

	self.searchPlaces = function(){
		self.clearPlaces();
		gMap.searchPlacesByType(self.currentPlace(), self.placeType.key);
	};

	self.getFavoritePlace = function(index){
		return self.model.defaultLocations[index];
	}


	self.getNearbyPlace = function(index){
		return self.model.nearbyPlaces()[index];
	}


	self.getNearbyPlaces = function(){
		return self.model.nearbyPlaces(); 
	}

    self.clearPlaces = function(){
    	///clear out the nearbyPlaces array
    	if (self.model.nearbyPlaces().length > 0){
    		self.model.nearbyPlaces.removeAll();
		}
    };

	self.addNearbyPlace = function(place){
		//nearbyPlaces.forEach(function(place){
			self.model.nearbyPlaces.push(new Place(place));
		//});


		///tell view that nearbyPlaces should be shown
		if (!self.model.nearbyVisible()){
			self.model.nearbyVisible(true);
		}
	};

	self.activateNearbyPlace = function( place ){
		gMap.activateCurrentMarker(place.index);
	}

	self.setCurrentWeather = function(weather){
		weather.readableWindDirection = getWindDirection(weather.windBearing);
		self.model.currentWeather(weather);
	};
};

var viewModel = new ViewModel();

ko.applyBindings(viewModel);