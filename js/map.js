///Sean Conrad Udacity Front End Neighborhood Map Project September 2016

function GoogleMap()
{	

	///declare variables 
	var self = this; 

	self.bounds;

	self.map;

	self.infoWindow;

	self.startingLocation = {lat: 47.609646, lng: -122.342117};

	self.currentNearbyPlace; 

	self.oldNearbyPlace; 

	self.smallMarker;

	self.largeMarker; 

	self.defaultMarkers = new Array(7);

	self.nearbyMarkers = [];

	self.nearbyPlaces = [];

	self.geocodeBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json?";


	///init map
	self.initMap = function() {
		self.map = new google.maps.Map(document.getElementById('map'), {
			center: self.startingLocation, 
			zoom: 12,
			enableTouchUI: true
		});
		
		///set up the places service
		self.service = new google.maps.places.PlacesService(self.map);
		///initialize some variables
		self.currentNearbyPlace = "";

		self.oldNearbyPlace = "";

		self.currentBigMarker = "";		

		///resize the map when the browser is resized 
		google.maps.event.addDomListener(window, "resize", function(){
			var center = self.map.getCenter();
			google.maps.event.trigger(self.map, "resize");
			self.map.setCenter(center);
		});

	};

	///uh oh!
	self.mapsError = function(){
		var mapDiv = docuement.getElementById('map');
		alert("Error!");
	};

	///take in an array of locations, create markers
	self.makeGeoCodeCall = function(zipcode, size) {
		///set up geocoder (TODO: move this out to initmap?)
		var geoCoder = new google.maps.Geocoder();
		///create request
		var request = {
			componentRestrictions: {
				country: 'US',
				postalCode: zipcode
			}
		};
		///fire request
		geoCoder.geocode(request, function(results, status){
			///response is good, send off the top result
			if (status === google.maps.GeocoderStatus.OK) {
				console.log(results);
				weather.currentLatLngWeather(results[0].geometry.location, function(response){
					viewModel.setCurrentWeather(response)
				})
				return results;
			}
			else {
				console.log(results);
				alert("Geocode unsuccessful, error: " + status);
			}
		});
	};


}

var gMap; 

var initMap = function() {
	gMap = new GoogleMap();
	gMap.initMap();
};


var gMapsErrorHandler = function (){
	alert("Could not load map, sorry about that. Please try refreshing the page.");
};