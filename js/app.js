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

function initLocations(){
	var bufferArray = ko.observableArray([]);

	favoritePlaces.forEach(function(location) {
		bufferArray().push(new Place(location));
	});

	return bufferArray();
}

var Model = function () {
    this.defaultLocations = initLocations();

};

var Place = function(data) {
	var self = this; 

	var state = 'WA'
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.street = ko.observable(data.street);
	this.city = ko.observable(data.city);
	this.state = ko.observable(state);
	this.address = ko.computed(function() { 
		return self.street() + ", " + self. city() + ", " + self.state() 
	});
	this.requestAddress = ko.computed(function() {
		return self.address().replace(" ", "+")
	});
}


var viewModel = function() {



	///to avoid any confusion later
	var self = this;


	self.model = new Model(); 

	self.filter = ko.observable("");
	//var MapApp = new initMap(); 

	self.placesList = ko.computed(function() {
		return self.model.defaultLocations;
	})



}

var ViewModel = new viewModel();

ko.applyBindings(ViewModel);