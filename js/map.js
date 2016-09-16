function Map()
{	

	///declare variables 
	var self = this; 

	this.bounds;

	this.map;

	this.defaultIcon;

	this.highlightedIcon;

	this.infoWindow;

	this.mapsApiKey;

	this.startingLocation = {lat: 47.609646, lng: -122.342117};

	self.searchBox;

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

		self.currentNearbyPlace = "";

		self.oldNearbyPlace;

		self.currentBigMarker = "";
		

		//self.searchBox = new google.maps.places.SearchBox(document.getElementById("search-text"));
		
		//self.searchBox.setBounds(self.bounds);


		//document.getElementById('search-button').addEventListener('click', function(){
			//executeSearch();
		//})


		///create markers for the default locations
		viewModel.placesList().forEach(function(place, index){
			self.locateAndCreateMarkers(place, "large");
		});


		google.maps.event.addDomListener(window, "resize", function(){
			var center = self.map.getCenter();
			google.maps.event.trigger(self.map, "resize");;
			self.map.setCenter(center);
		});

		google.maps.event.addListener(self.map, 'click', function(){
			self.toggleNearbyCollapse("hide");
			self.infoWindow.close();
		})

	}

	this.NearbyPlaceObject = function(index){
		this.button = $('#nearby-places-' + index);
		this.marker = self.nearbyMarkers[index];

		return this;
	}

	this.changeCurrentNearbyMarker = function(index){
		console.log(self.oldNearbyPlace === self.currentNearbyPlace);
		if (self.oldNearbyPlace != self.currentNearbyPlace){
			self.oldNearbyPlace = self.currentNearbyPlace;

			if (self.oldNearbyPlace != "") {
				self.oldNearbyPlace.button.collapse("hide");
				self.oldNearbyPlace.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
			}

			self.currentNearbyPlace = self.NearbyPlaceObject(index);

			self.currentNearbyPlace.button.collapse("show");
			self.currentNearbyPlace.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');

			console.log(self.currentNearbyPlace.button);
			console.log(self.oldNearbyPlace.button);
		}

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
		///innerhtml to an error message
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
						///re-set the bounds so the new locations are 
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
					self.changeCurrentNearbyMarker(results.index);
					/*if (self.currentNearbyPlace != ""){
						self.currentNearbyMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
						self.toggleNearbyCollapse("hide");
					}	
					self.currentNearbyPlace = $("#nearby-places-" + results.index);
					self.currentNearbyMarker = this;

					///toggle the detail dropdown in the locations list 
					self.toggleNearbyCollapse("show");*/
					

					///v2
					///viewModel.scaleDownNot(results.index);
				});
				///add to the 
				self.nearbyMarkers.push(marker);
			}

			//self.map.fitBounds(self.bounds);
		}; 

		this.getNearbyMarkers = function(){
			return self.nearbyMarkers;
		}


	this.setBounds = function(){
		var markers = self.getNearbyMarkers();
		self.newBounds = new google.maps.LatLngBounds();
		markers.forEach(function(marker){
			self.newBounds.extend(marker.position);
		});
		self.map.fitBounds(self.newBounds);
	}

	///do a places search for nearby establishments
	this.getPlaces = function(location, radius, placesType, size) {
		///make request for places

		if (placesType === "" || placesType === undefined) {
			placesType = viewModel.placeType().key;
		}

		request = {
			location: { lat: location.lat(), lng: location.lng() },
			radius: radius,
			type: [placesType]
		}

		if (self.nearbyMarkers.length > 0){
			self.nearbyMarkers.forEach(function(data){
				data.setMap(null);
			})
		}

		self.nearbyPlaces = [];

		self.service.nearbySearch(request, function(results, status){
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				if (results.length < 10 && radius < 3000)
				{
					self.getPlaces(location, (radius += 500), placesType)
				} else {
					var resultsSize = (results.length > 10) ? 10 : results.length;
					for (var i = 0; i < resultsSize; i++){
						results[i].index = i;	
						self.nearbyPlaces.push(results[i]);				
						self.createMarker(results[i], size, "small");
					}
					self.setBounds();
					viewModel.changeNearbyPlaces(self.nearbyPlaces);
					self.nearbyPlaces.forEach(function(place){
						$('#nearby-places-' + place.index).on('shown.bs.collapse', function(){
							self.changeCurrentNearbyMarker(place.index);
							console.log("shown");

							/*self.nearbyPlaces.forEach(function(otherPlace){
								if (otherPlace.index != place.index){
									console.log("collapse")
									$('#nearby-places-' + otherPlace.index).collapse("hide");
								};
							});*/
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

		///populate the sidebar for that item
	}

	


	this.toggleNearbyCollapse = function(state){
		if(self.currentNearbyPlace != ""){
			self.currentNearbyPlace.collapse(state);

		}
	}

	this.showInfo = function(marker, name){
		self.infoWindow.marker = marker;
		self.infoWindow.setContent(name);
		self.infoWindow.maxWidth = 500;
		self.infoWindow.open(self.map, marker);

	}

}

var gMap; 

var initMap = function() {
	gMap = new Map();
	gMap.initMap();
}