/*var map;
var address = "West Seattle Junction"

function initMap(){
	
	var self = this;

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 47.5629006, lng: -122.3889507}, 
		zoom: 13,
	});

	///Create bounds var
	var bounds = new google.maps.LatLngBounds;

	///Create infowindow obj 
	var infoWindow = new google.maps.InfoWindow({
		content: '',
		maxWidth: 200
	});

	self.placesSearch = function(placeData) {
		var place = placeData().name;
		var placesService = new google.maps.places.PlacesService(map);

		placesService.textSearch({
			query: place,
			bounds: bounds
		}), function(results, status){
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				createMarker(results);
			}
		}
	}

	self.createMarker = function(placeData, setMarkerData){
		var lat = placeData.geometry.location.lat();
		var lng = placeData.geometry.location.lng();
		var address = placeData.formatted_address;
		//console.log(placeData);

		var icon = {
			///make a custom icon?
		}

		///add name after determining what part of address to get
		var marker = new google.maps.Marker({
			map: map,
			animation: google.maps.Animation.DROP,
			position: {lat: lat, lng: lng}
		})

		//bounds.extend(marker.position);

		google.maps.event.addListener(marker, 'click', function(){
			setInfoWindow(marker, address, infowindow);
		});

		//map.fitBounds(bounds);

		}; 


		self.geoCodeAddress = function(locationNames, googleData){
			var gData;

			var geoCoder = new google.maps.Geocoder();

			var request = {
				address: locationNames.name()
			};

			geoCoder.geocode(request, function(results, status){
				if (status === google.maps.GeocoderStatus.OK) {
					if (typeof googleData === "function") {
						console.log(results);
						googleData(results[0]);
					}
				}
				else {
					alert("Geocode unsuccessful, error: " + status);
				}
			})
		}

};*/


var bounds;

var map;

var defaultIcon;

var highlightedIcon;

var infoWindow;

var mapsApiKey;

var startingLocation = {lat: 47.5629006, lng: -122.3889507};

function initMap() {

	var self = this;

	


	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 47.5629006, lng: -122.3889507}, 
		zoom: 13,
	});

	service = new google.maps.places.PlacesService(map);

	///Create bounds var
	bounds = new google.maps.LatLngBounds;

	///Create infowindow obj 
	infoWindow = new google.maps.InfoWindow({
		content: '',
		maxWidth: 200
	});

	ViewModel.placesList().forEach(function(place){
		locateAndCreateMarkers(place);
		//console.log(place.name());
	});



}

function mapsError(){
	var mapDiv = docuement.getElementById('map');
	///innerhtml to an error message
}

///
var geocodeBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json?";

function locateAndCreateMarkers(location) {
	var geoCoder = new google.maps.Geocoder();
	var request = {
		address: location.requestAddress()
	};



	geoCoder.geocode(request, function(results, status){
		if (status === google.maps.GeocoderStatus.OK) {
			createMarker(results[0], location);
		}
		else {
			alert("Geocode unsuccessful, error: " + status);
		}
	})
}



function createMarker(results, locationInfo){
		var lat = results.geometry.location.lat();
		var lng = results.geometry.location.lng();
		var address = results.formatted_address;
		//console.log(placeData);

		var icon = {
			///make a custom icon?
		}

		///add name after determining what part of address to get
		var marker = new google.maps.Marker({
			map: map,
			animation: google.maps.Animation.DROP,
			position: {lat: lat, lng: lng}
		})

		//bounds.extend(marker.position);

		google.maps.event.addListener(marker, 'click', function(){
			showInfo(this, locationInfo);
		});

		//map.fitBounds(bounds);

		}; 

function makeMarkerIcon(markerColor){

}

function showMarker(marker){

}

function getPlaces(location) {
	///make request for places
	request = {
		location: { lat: location.lat(), lng: location.lng() },
		radius: '100',
		type: ['restaurant']
	}

	service.nearbySearch(request, function(results, status){
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			results.forEach(function(result) {
				console.log(result);
			})
		}
	})

	///populate the sidebar for that item
}


function showInfo(marker, location){
	getPlaces(location);
	infoWindow.marker = marker;
	infoWindow.setContent(location.name());
	console.log(infoWindow.content);
	infoWindow.maxWidth = 500;
	infoWindow.open(map, marker);
}

