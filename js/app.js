///to be replaced by proper Google Maps Places objects
var favoritePlaces = [
	{
		name: 'Seattle Fish Company, West Seattle',
		lat: 47.5636926,
		lng: -122.3871439,
		street: '4435 California Ave SW',
		city: 'Seattle'
	},
	{
		name: 'Pagliacci Pizza, West Seattle',
		lat: 47.5633709,
		lng: -122.3875602,
		street: '4449 California Ave SW',
		city: 'Seattle'
	},
	{
		name: 'Farmers\' Market West Seattle',
		lat: 47.5610439,
		lng: -122.3884025,
		street: 'California Ave SW and SW Alaska St',
		city: 'Seattle'
	}
]

var favoritePlace = [
	{
		name: 'Farmers\' Market West Seattle',
		lat: 47.5610439,
		lng: -122.3884025,
		street: 'California Ave SW and SW Alaska St',
		city: 'Seattle'
	}
]

var initLocations = function(){
	var bufferArray = ko.observableArray([]);

	favoritePlaces.forEach(function(location) {
		bufferArray().push(new Place(location));
	});

	return bufferArray();
}

var Model = function () {
    this.defaultLocations = initLocations();
    this.nearbyVisible = ko.observable(false);
    this.nearbyList = initLocations();
};

var Place = function(data) {
	var self = this; 

	var state = 'WA'
	var lat = data.geometry ? data.geometry.location.lat() : data.lat;
	var lng = data.geometry ? data.geometry.location.lng() : data.lng;


	this.name = ko.observable(data.name);
	this.lat = ko.observable(lat);
	this.lng = ko.observable(lng);
	this.street = ko.observable(data.street);
	this.city = ko.observable(data.city);
	this.state = ko.observable(state);

	this.priceLevel = ko.observable(data.price_level);
	this.ratings = ko.observable(data.rating); 
	this.types = ko.observableArray(data.types);
	this.type = ko.observable(data.types ? data.types[0] : "none");

	this.address = ko.computed(function() { 
		return self.street() + ", " + self. city() + ", " + self.state() 
	});
	this.requestAddress = ko.computed(function() {
		return self.address().replace(" ", "+")
	});
}



var ViewModel = function() {

	///to avoid any confusion later
	var self = this;

	this.model = new Model(); 

    this.nearbyPlacesVisible = ko.computed(function(){
    	return self.model.nearbyVisible();
    })

	this.nearbyPlacesList = ko.observableArray([]);

	this.placesList = ko.computed(function() {
		return self.model.defaultLocations;
	}, this);


	this.logPlaces = function(){
		console.log(self.nearbyPlacesList().length);
		//this.nearbyPlacesList().forEach(function(place){
		//	console.log(place.name());
		//})
	};


	this.changeNearbyPlaces = function(nearbyPlaces){
		self.nearbyPlacesList([]);
		nearbyPlaces.forEach(function(place){
			self.nearbyPlacesList.push(new Place(place));
		});
		self.model.nearbyVisible(true);
	};


}

var viewModel = new ViewModel();

ko.applyBindings(viewModel);
