///Sean Conrad Udacity Front End Neighborhood Map Project September 2016

function Map()
{	

	///declare variables 
	var self = this; 

	this.bounds;

	this.map;

	this.infoWindow;

	this.startingLocation = {lat: 47.609646, lng: -122.342117};

	this.currentNearbyPlace; 

	this.oldNearbyPlace; 

	this.smallMarker;

	this.largeMarker; 

	this.defaultMarkers = [];

	this.nearbyMarkers = [];

	this.nearbyPlaces = [];

	this.geocodeBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json?";


	///init map
	self.initMap = function() {
		self.map = new google.maps.Map(document.getElementById('map'), {
			center: self.startingLocation, 
			zoom: 12,
			enableTouchUI: true
		});
		///set up the places service
		self.service = new google.maps.places.PlacesService(self.map);

		///Create bounds var
		self.bounds = new google.maps.LatLngBounds();

		///Create infowindow obj 
		self.infoWindow = new google.maps.InfoWindow({
			content: '',
			maxWidth: 200
		});

		///initialize some variables
		self.currentNearbyPlace = "";

		self.oldNearbyPlace = "";

		self.currentBigMarker = "";		

		///create markers for the default locations
		viewModel.placesList().forEach(function(place, index){
			self.locateAndCreateMarkers(place, "large");
			
		});

		///resize the map when the browser is resized 
		google.maps.event.addDomListener(window, "resize", function(){
			var center = self.map.getCenter();
			google.maps.event.trigger(self.map, "resize");
			self.map.setCenter(center);
		});

		///listen for a non-marker click to close the current marker info and close the info window
		google.maps.event.addListener(self.map, 'click', function(){			
			if (self.currentBigMarker !== "") {
				self.toggleNearbyCollapse("hide");
				self.infoWindow.close();
				viewModel.setCurrentPlace('null');
				self.clearNearbyPlaces();
				self.currentBigMarker.marker.setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png');
				self.map.fitBounds(self.bounds);
				self.currentBigMarker = "";
				}
		});

	};

	this.changeDefault = function(index, showOrHide){
		if (showOrHide === "hide"){
			self.defaultMarkers[index].marker.setMap(null);
		} else if (showOrHide === "show"){
			self.defaultMarkers[index].marker.setMap(self.map);
		}
	};

	this.clearNearbyPlaces = function(){		
		if (self.nearbyMarkers.length > 0){
			self.nearbyMarkers.forEach(function(data){
				data.setMap(null);
			});
		}
		self.closeNearbyPlace(self.oldNearbyPlace);
		self.closeNearbyPlace(self.currentNearbyPlace);
		self.oldNearbyPlace = "";
		self.currentNearbyPlace = "";
	};

	this.resetNearby = function(){
		self.nearbyPlaces.forEach(function(place){
			viewModel.changeNearbyCSS(place.index, "nearby-place");
		});
	};

	this.closeNearbyPlace = function(place){
		///check to see if there is an old nearbyplace
		if (place !== "") {
			///collapse the button info
			place.button.collapse("hide");
			///reset the marker color
			place.marker.setIcon('https://maps.google.com/mapfiles/ms/icons/green-dot.png');	
		}
	};

	this.changeOldMarker = function(){
		self.closeNearbyPlace(self.oldNearbyPlace);
		///assign the old nearbyplace to be the current one so it may be changed when the next one is selected
		self.oldNearbyPlace = self.currentNearbyPlace;
	};
  
	this.activateCurrentMarker = function(index){
		///create the new currentNearbyPlace variable
		console.log(index);
		self.currentNearbyPlace = self.nearbyMarkers[index];
		console.log
		viewModel.setCurrentNearbyPlace(index);
		///change the marker color
		self.currentNearbyPlace.setIcon('https://maps.google.com/mapfiles/ms/icons/orange-dot.png');
		self.showInfo(self.currentNearbyPlace, viewModel.getNearbyPlace(index).infoWindow())
	};




	///when searching by a specific type
	this.searchPlacesByType = function(currentPlace, placeType){
		self.getPlaces(currentPlace, 2000, placeType);
	};

	///and when just searching by default type (restaurant)
	this.searchPlacesByArea = function(location, radius){
		self.getPlaces(location, radius, "", "");
	};

	///uh oh!
	this.mapsError = function(){
		var mapDiv = docuement.getElementById('map');
		alert("Error!");
	};

	///take in an array of locations, create markers
	this.locateAndCreateMarkers = function(location, size) {
		///set up geocoder (TODO: move this out to initmap?)
		var geoCoder = new google.maps.Geocoder();
		///create request
		var request = {
			address: location.requestAddress
		};
		///fire request
		geoCoder.geocode(request, function(results, status){
			///response is good, send off the top result
			if (status === google.maps.GeocoderStatus.OK) {
				self.createMarker(results[0], location, size);	
			}
			else {
				alert("Geocode unsuccessful, error: " + status);
			}
		});
	};

	this.createMarker = function(results, locationInfo, size){
			///prep the necessary variables
			var lat = results.geometry.location.lat();
			var lng = results.geometry.location.lng();
			var address = results.formatted_address;

			
			///add name after determining what part of address to get
			var marker = new google.maps.Marker({
				map: self.map,
				animation: google.maps.Animation.DROP,
				position: {lat: lat, lng: lng}
			});
			self.bounds.extend(marker.position);

			var markerObject = {'marker': marker, 'location': locationInfo};
			
			///if it's a large marker, it is a default location. 
			if (size === "large"){
				markerObject.marker.setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png');
				///starting radius is 500 meters
				var placesRadius = 500;
				///add a listener to the marker
				google.maps.event.addListener(markerObject.marker, 'click', function(){
					if (self.currentBigMarker !== this) {
						self.setCurrentPlace(markerObject.location.index);
					}
				});								
					///add to default locations array
				self.defaultMarkers.push(markerObject);
				var clickLink = document.getElementById('favorite-place-' + markerObject.location.index);
				clickLink.onclick = function(){
					self.setCurrentPlace(markerObject.location.index);
				};
			} else if (size === "small"){
				marker.setIcon('https://maps.google.com/mapfiles/ms/icons/green-dot.png');
				///if it's a small marker, it's a nearby place.
				///add a listener to the marker
				google.maps.event.addListener(marker, 'click', function(){				
					///show the name of the location
					///self.showInfo(this, viewModel.getNearbyPlace(results.index).infoWindow());	
					///expand and change color of the current marker
					self.activateCurrentMarker(results.index);
					///collapse and change color of the old marker
					self.changeOldMarker(self.currentNearbyPlace);
				});
				///add to the 
				self.nearbyMarkers.push(marker);
			}
		}; 

	this.setCurrentPlace = function(index){
		var thisMarker = self.defaultMarkers[index];
		if (self.currentBigMarker !== thisMarker) {
			thisMarker.marker.setIcon('https://maps.google.com/mapfiles/ms/icons/red-dot.png');
			if(self.currentBigMarker !==  ""){
				self.currentBigMarker.marker.setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png');
			}
			///popup the name of the location
			self.showInfo(thisMarker.marker, viewModel.getFavoritePlace(index).infoWindow());
			self.currentBigMarker = thisMarker;
			///clear old nearby places if they exist	
			viewModel.clearPlaces();	
			///do a standard search of nearby restaurants 			 
			self.searchPlacesByArea(thisMarker.location, 500);
			///set the clicked marker as the current location
			viewModel.setCurrentPlace(thisMarker.location);	
		}

	};

	this.getNearbyMarkers = function(){
		return self.nearbyMarkers;
	};


	this.setBounds = function(){
		///get the current nearbymarkers 
		var markers = self.getNearbyMarkers();
		///create a new bounds object
		var newBounds = new google.maps.LatLngBounds();

		///use the nearbymarkers to assign the bounds
		markers.forEach(function(marker){
			newBounds.extend(marker.position);
		});

		///and apply them to the map
		self.map.fitBounds(newBounds);
	};

	///do a places search for nearby establishments
	this.getPlaces = function(location, radius, placesType, size) {
		///make request for places
		///grab the placeType from the dropdown on the page
		if (viewModel.placeType() === undefined) {
			placesType = "restaurant";
		} else {
			placesType = viewModel.placeType().key;
		}
		///create request variable 
		request = {
			location: { lat: location.lat, lng: location.lng },
			radius: radius,
			type: placesType
		};

		///hide the old markers
		if (self.nearbyMarkers.length > 0){
			self.nearbyMarkers.forEach(function(data){
				data.setMap(null);
			});
		}

		viewModel.clearPlaces();
		//self.nearbyPlaces = [];  TODO remove 
		self.nearbyMarkers = [];

		self.service.nearbySearch(request, function(results, status){
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				////if there are fewer than 10 results and the radius is under 3KM, increase radius and try again
				if (results.length < 10 && radius < 3000)
				{
					self.getPlaces(location, (radius += 500), placesType);
				} else {
					/// if there are fewer than 10, use the results length size, otherwise use the first 10
					var resultsSize = (results.length > 10) ? 10 : results.length;
					for (var i = 0; i < resultsSize; i++){
						results[i].index = i;	
						self.nearbyPlaces.push(results[i]);				
						self.createMarker(results[i], size, "small");
						viewModel.addNearbyPlace(results[i]);
					}
					///reset the bounds for the new markers
					self.setBounds();
					///set up listeners for when the user clicks on a nearby place button instead of a marker
					viewModel.getNearbyPlaces().forEach(function(place){
						$('#nearby-places-' + place.index).on('shown.bs.collapse', function(){
							//these if statements are necessary so this is only called when the user clicks on the button and not when user clicks on the marker
							///if the index is equal, either seeing a marker-opened event or have clicked on the same marker twice
							///how to differentiate
							if (self.currentNearbyPlace.index == place.index){
								///do nothing
							} else 	if (self.currentNearbyPlace.index != place.index){
								///this will be hit if user clicked on a new button
								//self.showInfo(self.nearbyMarkers[place.index], viewModel.getNearbyPlace(place.index).infoWindow());	
								///expand and change color of the current marker
								self.activateCurrentMarker(place.index);
								///collapse and change color of the old marker
								self.changeOldMarker(self.currentNearbyPlace);
							} else if (self.currentNearbyPlace.index === undefined){
								///this will be hit if the first action is clicking a button
								//self.showInfo(self.nearbyMarkers[place.index], viewModel.getNearbyPlace(place.index).infoWindow());	
								///expand and change color of the current marker
								self.activateCurrentMarker(place.index);
								///collapse and change color of the old marker
								self.changeOldMarker(self.currentNearbyPlace);
							}
						});
					});
				}	
			} else
			{
				if (radius < 3000)
				{
					self.getPlaces(location, (radius += 500), placesType);
				}
			}
		});
		weather.currentLatLngWeather(location);

		//weather.forecastCity(location);
	};


	/*this.movePlaceToTop = function(index){
		viewModel.movePlaceToTop(index);
		var buffer = self.nearbyPlaces[0];
		self.nearbyPlaces[0] = self.nearbyPlaces[index];
		self.nearbyPlaces[index] = buffer; 

		var buffer1 = self.nearbyMarkers[0];
		self.nearbyMarkers[0] = self.nearbyMarkers[index];
		self.nearbyMarkers[index] = buffer1;
	}*/
	


	this.toggleNearbyCollapse = function(state){
		if(self.currentNearbyPlace !== ""){
			self.currentNearbyPlace.button.collapse(state);
		}
	};

	this.showInfo = function(marker, div){
		///assign which marker to open the info window above
		console.log(marker);
		self.infoWindow.marker = marker;
		///assign the content
		console.log(div);
		self.infoWindow.setContent(div);
		self.infoWindow.maxWidth = 500;
		///open it
		self.infoWindow.open(self.map, marker);
	};

}

var gMap; 

var initMap = function() {
	gMap = new Map();
	gMap.initMap();
};


var gMapsErrorHandler = function (){
	alert("Could not load map, sorry about that. Please try refreshing the page.");
};