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

	this.nearbyPlaces;

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
		self.bounds = new google.maps.LatLngBounds;

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
			google.maps.event.trigger(self.map, "resize");;
			self.map.setCenter(center);
		});

		///listen for a non-marker click to close the current marker info and close the info window
		google.maps.event.addListener(self.map, 'click', function(){
			self.toggleNearbyCollapse("hide");
			self.infoWindow.close();
			viewModel.setCurrentPlace('null');
			self.clearNearbyPlaces();
			self.currentBigMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
			self.map.fitBounds(self.bounds);
		})

	}

	this.NearbyPlaceObject = function(index){
		this.button = $('#nearby-places-' + index);
		this.marker = self.nearbyMarkers[index];
		this.index = index;
	}

	this.clearNearbyPlaces = function(){		
		if (self.nearbyMarkers.length > 0){
			self.nearbyMarkers.forEach(function(data){
				data.setMap(null);
			})
		}
		self.closeNearbyPlace(self.oldNearbyPlace);
		self.closeNearbyPlace(self.currentNearbyPlace);
		self.oldNearbyPlace = "";
		self.currentNearbyPlace = "";
	}

	this.closeNearbyPlace = function(place){
		///check to see if there is an old nearbyplace
		if (place != "") {
			///collapse the button info
			place.button.collapse("hide");
			///reset the marker color
			place.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');	
		}
	}

	this.changeOldMarker = function(){
		self.closeNearbyPlace(self.oldNearbyPlace);
		///assign the old nearbyplace to be the current one so it may be changed when the next one is selected
		self.oldNearbyPlace = self.currentNearbyPlace;
		
	}
	this.activateCurrentMarker = function(index){
		///create the new currentNearbyPlace variable
		self.currentNearbyPlace = new self.NearbyPlaceObject(index);
		///expand the button with the place's info
		self.currentNearbyPlace.button.collapse("show");
		///change the marker color
		self.currentNearbyPlace.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/orange-dot.png');
	}




	///when searching by a specific type
	this.searchPlacesByType = function(currentPlace, placeType){
		self.getPlaces(currentPlace, 2000, placeType);
	}

	///and when just searching by default type (restaurant)
	this.searchPlacesByArea = function(location, radius){
		self.getPlaces(location, radius, "", "");
	}

	///uh oh!
	this.mapsError = function(){
		var mapDiv = docuement.getElementById('map');
		alert("Error!");
	}

	///take in an array of locations, create markers
	this.locateAndCreateMarkers = function(location, size) {
		///set up geocoder (TODO: move this out to initmap?)
		var geoCoder = new google.maps.Geocoder();
		///create request
		var request = {
			address: location.requestAddress()
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
		})
	}

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
			})
			self.bounds.extend(marker.position);


			
			///if it's a large marker, it is a default location. 
			if (size === "large"){
				marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
				///starting radius is 500 meters
				var placesRadius = 500;
				///add a listener to the marker
				google.maps.event.addListener(marker, 'click', function(){
					if (self.currentBigMarker !== this) {
						marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
						if(self.currentBigMarker !=  ""){
							self.currentBigMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
						}
						///popup the name of the location
						self.showInfo(this, locationInfo.name());
						self.currentBigMarker = this;
						///clear old nearby places if they exist	
						viewModel.clearPlaces();	
						///do a standard search of nearby restaurants 			 
						self.searchPlacesByArea(locationInfo, placesRadius);
						///set the clicked marker as the current location
						viewModel.setCurrentPlace(locationInfo);	
					}
				});								
					///add to default locations array
				self.defaultMarkers.push(marker);
			} else if (size === "small"){
				marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
				///if it's a small marker, it's a nearby place.
				///add a listener to the marker
				google.maps.event.addListener(marker, 'click', function(){				
					///show the name of the location
					self.showInfo(this, results.name);	
					///expand and change color of the current marker
					self.activateCurrentMarker(results.index);
					///collapse and change color of the old marker
					self.changeOldMarker(self.currentNearbyPlace);
				});
				///add to the 
				self.nearbyMarkers.push(marker);
			}
		}; 

	this.getNearbyMarkers = function(){
		return self.nearbyMarkers;
	}


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
	}

	///do a places search for nearby establishments
	this.getPlaces = function(location, radius, placesType, size) {
		///make request for places
		///grab the placeType from the dropdown on the page
		if (placesType === "" || placesType === undefined) {
			placesType = viewModel.placeType().key;
		}
		///create request variable 
		request = {
			location: { lat: location.lat(), lng: location.lng() },
			radius: radius,
			type: [placesType]
		}

		///hide the old markers
		if (self.nearbyMarkers.length > 0){
			self.nearbyMarkers.forEach(function(data){
				data.setMap(null);
			})
		}

		self.nearbyPlaces = [];
		self.nearbyMarkers = [];

		self.service.nearbySearch(request, function(results, status){
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				////if there are fewer than 10 results and the radius is under 3KM, increase radius and try again
				if (results.length < 10 && radius < 3000)
				{
					self.getPlaces(location, (radius += 500), placesType)
				} else {
					/// if there are fewer than 10, use the results length size, otherwise use the first 10
					var resultsSize = (results.length > 10) ? 10 : results.length;
					for (var i = 0; i < resultsSize; i++){
						results[i].index = i;	
						self.nearbyPlaces.push(results[i]);				
						self.createMarker(results[i], size, "small");
					}
					///reset the bounds for the new markers
					self.setBounds();
					///assign the new nearby places to the viewmodel
					viewModel.changeNearbyPlaces(self.nearbyPlaces);
					///set up listeners for when the user clicks on a nearby place button instead of a marker
					self.nearbyPlaces.forEach(function(place){
						$('#nearby-places-' + place.index).on('shown.bs.collapse', function(){
							//these if statements are necessary so this is only called when the user clicks on the button and not when user clicks on the marker
							///if the index is equal, either seeing a marker-opened event or have clicked on the same marker twice
							///how to differentiate
							if (self.currentNearbyPlace.index == place.index){
								///do nothing
							} else 	if (self.currentNearbyPlace.index != place.index){
								///this will be hit if user clicked on a new button
								///expanded by itself
								///change marker color
								self.currentNearbyPlace = new self.NearbyPlaceObject(place.index);
								self.currentNearbyPlace.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
															///ensure there is an old place to modify
								if (self.oldNearbyPlace != ""){
									///close old button, change old marker color
									self.oldNearbyPlace.button.collapse("hide");
									self.oldNearbyPlace.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
									
								}
									//assign old button to be the new button
									///asign old nearbyplace 
									self.oldNearbyPlace = self.currentNearbyPlace;
							} else if (self.currentNearbyPlace.index == undefined){
								///this will be hit if the first action is clicking a button
								///expanded by itself
								///change marker color
								self.currentNearbyPlace = self.NearbyPlaceObject(place.index);
								self.currentNearbyPlace.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
								///ensure there is an old place to modify
								if (self.oldNearbyPlace != ""){
									///close old button, change old marker color
									self.oldNearbyPlace.button.collapse("hide");
									self.oldNearbyPlace.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
									}
									//assign old button to be the new button
									self.oldNearbyPlace = self.currentNearbyPlace;
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
		})
		weather.currentLatLngWeather(location);

		//weather.forecastCity(location);
	}

	


	this.toggleNearbyCollapse = function(state){
		if(self.currentNearbyPlace != ""){
			self.currentNearbyPlace.button.collapse(state);
		}
	}

	this.showInfo = function(marker, name){
		///assign which marker to open the info window above
		self.infoWindow.marker = marker;
		///assign the content
		self.infoWindow.setContent(name);
		self.infoWindow.maxWidth = 500;
		///open it
		self.infoWindow.open(self.map, marker);
	}

}

var gMap; 

var initMap = function() {
	gMap = new Map();
	gMap.initMap();
}