function Map()
{	
	var self = this; 

	this.bounds;

	this.map;

	this.defaultIcon;

	this.highlightedIcon;

	this.infoWindow;

	this.mapsApiKey;

	this.startingLocation = {lat: 47.609646, lng: -122.342117};

	self.searchBox;

	this.nearbyPlaces;

	this.smallerMark;

	this.largeMarker; 

	this.geocodeBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json?";

	self.initMap = function() {
		self.map = new google.maps.Map(document.getElementById('map'), {
			center: self.startingLocation, 
			zoom: 12,
			enableTouchUI: true
		});

		self.service = new google.maps.places.PlacesService(self.map);

		///Create bounds var
		self.bounds = new google.maps.LatLngBounds;

		///Create infowindow obj 
		self.infoWindow = new google.maps.InfoWindow({
			content: '',
			maxWidth: 200
		});

		self.smallMarker = new google.maps.Size(10, 16);

		self.largeMarker = new google.maps.Size(20, 32);
		

		self.searchBox = new google.maps.places.SearchBox(document.getElementById("search-text"));
		
		self.searchBox.setBounds(self.bounds);


		document.getElementById('search-button').addEventListener('click', function(){
			//executeSearch();
		})



		viewModel.placesList().forEach(function(place, index){
			self.locateAndCreateMarkers(place, self.largeMarker);
		});

	}

	this.searchPlacesByType = function(currentPlace, placeType){
		self.getPlaces(currentPlace, 2000, placeType);
	}

	this.searchPlacesByArea = function(location, radius){
		self.getPlaces(location, radius, "", "");
	}


	this.mapsError = function(){
		var mapDiv = docuement.getElementById('map');
		alert("Error!");
		///innerhtml to an error message
	}

	this.locateAndCreateMarkers = function(location, size) {
		var geoCoder = new google.maps.Geocoder();
		var request = {
			address: location.requestAddress()
		};


		geoCoder.geocode(request, function(results, status){
			if (status === google.maps.GeocoderStatus.OK) {
				self.createMarker(results[0], location, size);			
			}
			else {
				alert("Geocode unsuccessful, error: " + status);
			}
		})
	}

	this.createMarker = function(results, locationInfo, size){
			var lat = results.geometry.location.lat();
			var lng = results.geometry.location.lng();
			var address = results.formatted_address;
			//console.log(placeData);

			/*var icon = {
			    // This marker is 20 pixels wide by 32 pixels high.
			    size: size,
			    // The origin for this image is (0, 0).
			    origin: new google.maps.Point(0, 0),
			    // The anchor for this image is the base of the flagpole at (0, 32).
			    anchor: new google.maps.Point(0, 32)
			  };*/

			///add name after determining what part of address to get
			var marker = new google.maps.Marker({
				map: self.map,
				animation: google.maps.Animation.DROP,
				position: {lat: lat, lng: lng}
			})

			self.bounds.extend(marker.position);

			google.maps.event.addListener(marker, 'click', function(){
				self.showInfo(this, locationInfo);
			});


			self.map.fitBounds(self.bounds);

		}; 


	this.getPlaces = function(location, radius, placesType) {
		///make request for places
		if (placesType === "" || placesType === undefined) {
			placesType = viewModel.placeType().key;
		}

		
		request = {
			location: { lat: location.lat(), lng: location.lng() },
			radius: radius,
			type: [placesType]
		}
		

		var nearbyPlaces = [];

		//console.log(request);
		
		self.service.nearbySearch(request, function(results, status){	
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				if (results.length < 10 && radius < 3000)
				{
					self.getPlaces(location, (radius += 1000), placesType)
				} else {
					var resultsSize = (results.length > 10) ? 10 : results.length;
					for (var i = 0; i < resultsSize; i++){
						nearbyPlaces.push(results[i]);
						self.createMarker(results[i], "spork", self.smallMarker);
					}
					viewModel.changeNearbyPlaces(nearbyPlaces);
				}	
			} else
			{
				if (radius < 3000)
				{
					self.getPlaces(location, (radius += 1000), placesType);
				}
			}
		})
		weather.currentLatLngWeather(location);

		//weather.forecastCity(location);

		///populate the sidebar for that item
	}


	this.showInfo = function(marker, location){
		viewModel.clearPlaces(); 
		var placesRadius = 2000;
		self.searchPlacesByArea(location, placesRadius);
		self.infoWindow.marker = marker;
		self.infoWindow.setContent(location.name());
		self.infoWindow.maxWidth = 500;
		self.infoWindow.open(self.map, marker);
		viewModel.setCurrentPlace(location);

	}

}

var gMap; 

var initMap = function() {
	gMap = new Map();
	gMap.initMap();
}