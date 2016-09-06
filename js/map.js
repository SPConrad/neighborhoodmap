var bounds;

var map;

var defaultIcon;

var highlightedIcon;

var infoWindow;

var mapsApiKey;

var startingLocation = {lat: 47.609646, lng: -122.342117};

var nearbyPlaces;

var geocodeBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json?";

function initMap() {

	var self = this;

	map = new google.maps.Map(document.getElementById('map'), {
		center: startingLocation, 
		zoom: 12,
	});

	service = new google.maps.places.PlacesService(map);

	///Create bounds var
	bounds = new google.maps.LatLngBounds;

	///Create infowindow obj 
	infoWindow = new google.maps.InfoWindow({
		content: '',
		maxWidth: 200
	});

	viewModel.placesList().forEach(function(place, index){
		locateAndCreateMarkers(place);
	});

}

function mapsError(){
	var mapDiv = docuement.getElementById('map');
	///innerhtml to an error message
}

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

		bounds.extend(marker.position);

		google.maps.event.addListener(marker, 'click', function(){
			showInfo(this, locationInfo);
		});

		map.fitBounds(bounds);

	}; 


function getPlaces(location, radius) {
	///make request for places
	var nearbyPlaces = [];
	request = {
		location: { lat: location.lat(), lng: location.lng() },
		radius: radius,
		type: ['restaurant']
	}

	service.nearbySearch(request, function(results, status){		
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			if (results.length < 10 && radius < 2000)
			{
				getPlaces(location, (radius += 1000))
			} else {
				for (var i = 0; i < 10; i++){
					nearbyPlaces.push(results[i]);
				}
				viewModel.changeNearbyPlaces(nearbyPlaces);
			}	
		} else
		{
			if (radius < 3000)
			{
				getPlaces(location, (radius += 1000));
			}
		}
	})
	//weather.currentLatLngWeather(location);

	weather.forecastCity(location);

	///populate the sidebar for that item
}


function showInfo(marker, location){
	viewModel.clearPlaces(); 
	var placesRadius = 2000;
	getPlaces(location, placesRadius);
	viewModel.setCurrentPlace(location);
	infoWindow.marker = marker;
	infoWindow.setContent(location.name());
	infoWindow.maxWidth = 500;
	infoWindow.open(map, marker);
}

