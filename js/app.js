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

var favoritePlace = {
	name: 'Farmers\' Market West Seattle',
	lat: 47.5610439,
	lng: -122.3884025,
	street: 'California Ave SW and SW Alaska St',
	city: 'Seattle',
	state: 'WA'
}

function initLocations(){
	var bufferArray = ko.observableArray([]);

	favoritePlaces.forEach(function(location) {
		bufferArray().push(new Place(location));
	});

	return bufferArray();
}

var Model = function () {
    this.defaultLocations = initLocations();

    this.startLocation = new Place(favoritePlace);
};

var Place = function(data) {
	var state = 'WA'
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.street = ko.observable(data.street);
	this.city = ko.observable(data.city);
	this.state = ko.observable(state);
	//console.log(data);
}


var viewModel = function() {



	///to avoid any confusion later
	var self = this;


	self.model = new Model(); 

	self.filter = ko.observable("");

	self.startPlace = ko.computed(function() {
		return self.model.startLocation;
	});
	//var MapApp = new initMap(); 

	self.placesList = ko.computed(function() {
		return self.model.defaultLocations;
	})



}

var ViewModel = new viewModel();

ko.applyBindings(ViewModel);