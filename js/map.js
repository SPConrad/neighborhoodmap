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

		self.oldNearbyPlace = "";

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
		this.index = index;
	}

	this.changeOldMarker = function(index, data){
		//console.log("======== change old marker =======")
		//console.log("came from " + data);
		if (self.oldNearbyPlace != "") {
			//console.log("hide old button " + self.oldNearbyPlace.index);
			self.oldNearbyPlace.button.collapse("hide");
			//console.log("change old marker " + self.oldNearbyPlace.index);
			self.oldNearbyPlace.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');	
		}

		//console.log("change old from " + self.oldNearbyPlace.index + " to " + self.currentNearbyPlace + ", passed in index is " + index);
		self.oldNearbyPlace = self.currentNearbyPlace;
		
	}
	this.activateCurrentMarker = function(index, data){
		//console.log("-----assign currentNearbyPlace----- " + index);
		//console.log("came from: " + data);
		self.currentNearbyPlace = self.NearbyPlaceObject(index);

		//console.log("show button on index -------------- " + index);
		self.currentNearbyPlace.button.collapse("show");
		//console.log("change marker color --------------- " + index);
		self.currentNearbyPlace.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
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
					///expand and change color of the current marker
					//self.activateCurrentMarker(results.index, "marker click");
					///collapse and change color of the old marker
					//self.changeOldMarker(results.index, "marker click");
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
							//self.changeCurrentNearbyMarker(results.index);
							///if the index is equal, either seeing a marker-opened event or have clicked on the same marker twice
							///how to differentiate
							if (self.currentNearbyPlace.index == place.index){
								console.log("index equal")
							} else 	if (self.currentNearbyPlace.index != place.index){
								///this will be hit if user clicked on a new button
								console.log("index not equal")

								///expanded by itself
								///change marker color
								self.currentNearbyPlace = new self.NearbyPlaceObject(place.index);
								console.log("current nearby place index " + self.currentNearbyPlace.index)
								self.currentNearbyPlace.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
							
								///ensure there is an old place to modify
								if (self.oldNearbyPlace != ""){
									console.log("old nearby place exists and index is " + self.oldNearbyPlace.index);
									///close old button, change old marker color
									self.oldNearbyPlace.button.collapse("hide");
									self.oldNearbyPlace.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
									
								}
									//assign old button to be the new button
									///asign old nearbyplace 
									self.oldNearbyPlace = self.currentNearbyPlace;
									console.log("old nearby place index is now " + self.oldNearbyPlace.index);
							} else if (self.currentNearbyPlace.index == undefined){
								///this will be hit if the first action is clicking a button
								console.log("undefined")
								///expanded by itself
								///change marker color
								self.currentNearbyPlace = self.NearbyPlaceObject(place.index);
								self.currentNearbyPlace.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
								///ensure there is an old place to modify
								if (self.oldNearbyPlace != ""){
									///close old button, change old marker color
									self.oldNearbyPlace.button.collapse("hide");
									self.oldNearbyPlace.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
									
									//assign old button to be the new button
								}
									//assign old button to be the new button
									self.oldNearbyPlace = self.currentNearbyPlace;
									console.log("old nearby place index is now " + self.oldNearbyPlace.index);
							}
							});
					});
							
							

							//self.openedByMarkerClick = false;

							/*self.nearbyPlaces.forEach(function(otherPlace){
								if (otherPlace.index != place.index){
									//console.log("collapse")
									$('#nearby-places-' + otherPlace.index).collapse("hide");
								};
							});*/
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
			//console.log("XXXXXXXXXXXXXXXXXX collapse nearby XXXXXXXXXXXXXXXXXXXXXX");
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