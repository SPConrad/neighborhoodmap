///to be replaced by proper Google Maps Places objects
var favorties = [
	{
		name: 'Place 1',
		lat: '',
		long: ''
	},
	{
		name: 'Place 2',
		lat: '',
		long: ''
	},
]

//var location = function(data) {
	///create a location object 
//}

var viewModel = function() {
	///to avoid any confusion later
	var self = this;
	this.map = ko.observable()
	self.placesList = ko.observableArray([]);


}

function initMap(){
	this.map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644}, 
		zoom: 8
	});
}


ko.applyBindings(new viewModel());