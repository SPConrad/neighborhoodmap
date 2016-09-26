function Map(){var a=this;this.bounds,this.map,this.infoWindow,this.startingLocation={lat:47.609646,lng:-122.342117},this.currentNearbyPlace,this.oldNearbyPlace,this.nearbyPlaces,this.smallMarker,this.largeMarker,this.defaultMarkers=[],this.nearbyMarkers=[],this.nearbyPlaces=[],this.geocodeBaseUrl="https://maps.googleapis.com/maps/api/geocode/json?",a.initMap=function(){a.map=new google.maps.Map(document.getElementById("map"),{center:a.startingLocation,zoom:12,enableTouchUI:!0}),a.service=new google.maps.places.PlacesService(a.map),a.bounds=new google.maps.LatLngBounds,a.infoWindow=new google.maps.InfoWindow({content:"",maxWidth:200}),a.currentNearbyPlace="",a.oldNearbyPlace="",a.currentBigMarker="",viewModel.placesList().forEach(function(b,c){a.locateAndCreateMarkers(b,"large")}),google.maps.event.addDomListener(window,"resize",function(){var b=a.map.getCenter();google.maps.event.trigger(a.map,"resize"),a.map.setCenter(b)}),google.maps.event.addListener(a.map,"click",function(){""!==a.currentBigMarker&&(a.toggleNearbyCollapse("hide"),a.infoWindow.close(),viewModel.setCurrentPlace("null"),a.clearNearbyPlaces(),a.currentBigMarker.marker.setIcon("https://maps.google.com/mapfiles/ms/icons/blue-dot.png"),a.map.fitBounds(a.bounds),a.currentBigMarker="")})},this.changeDefault=function(b,c){"hide"===c?a.defaultMarkers[b].marker.setMap(null):"show"===c&&(a.defaultMarkers[b].marker.setMap(a.map),a.createClickLink(b))},this.NearbyPlaceObject=function(b){this.button=$("#nearby-places-"+b),this.marker=a.nearbyMarkers[b],this.index=b},this.clearNearbyPlaces=function(){a.nearbyMarkers.length>0&&a.nearbyMarkers.forEach(function(a){a.setMap(null)}),a.closeNearbyPlace(a.oldNearbyPlace),a.closeNearbyPlace(a.currentNearbyPlace),a.oldNearbyPlace="",a.currentNearbyPlace=""},this.resetNearby=function(){a.nearbyPlaces.forEach(function(a){viewModel.changeNearbyCSS(a.index,"nearby-place")})},this.closeNearbyPlace=function(a){""!==a&&(a.button.collapse("hide"),a.marker.setIcon("https://maps.google.com/mapfiles/ms/icons/green-dot.png"))},this.changeOldMarker=function(){a.closeNearbyPlace(a.oldNearbyPlace),a.oldNearbyPlace=a.currentNearbyPlace},this.activateCurrentMarker=function(b){a.currentNearbyPlace=new a.NearbyPlaceObject(b),viewModel.setCurrentNearbyPlace(a.currentNearbyPlace),a.currentNearbyPlace.button.collapse("show"),a.currentNearbyPlace.marker.setIcon("https://maps.google.com/mapfiles/ms/icons/orange-dot.png")},this.searchPlacesByType=function(b,c){a.getPlaces(b,2e3,c)},this.searchPlacesByArea=function(b,c){a.getPlaces(b,c,"","")},this.mapsError=function(){docuement.getElementById("map");alert("Error!")},this.locateAndCreateMarkers=function(b,c){var d=new google.maps.Geocoder,e={address:b.requestAddress};d.geocode(e,function(d,e){e===google.maps.GeocoderStatus.OK?a.createMarker(d[0],b,c):alert("Geocode unsuccessful, error: "+e)})},this.createMarker=function(b,c,d){var e=b.geometry.location.lat(),f=b.geometry.location.lng(),h=(b.formatted_address,new google.maps.Marker({map:a.map,animation:google.maps.Animation.DROP,position:{lat:e,lng:f}}));a.bounds.extend(h.position);var i={marker:h,location:c};if("large"===d){i.marker.setIcon("https://maps.google.com/mapfiles/ms/icons/blue-dot.png");google.maps.event.addListener(i.marker,"click",function(){a.currentBigMarker!==this&&a.setCurrentPlace(i.location.index)}),a.defaultMarkers.push(i),a.createClickLink(i.location.index);var k=document.getElementById("favorite-place-"+i.location.index);k.onclick=function(){a.setCurrentPlace(i.location.index)}}else"small"===d&&(h.setIcon("https://maps.google.com/mapfiles/ms/icons/green-dot.png"),google.maps.event.addListener(h,"click",function(){a.showInfo(this,b.name),a.activateCurrentMarker(b.index),a.changeOldMarker(a.currentNearbyPlace)}),a.nearbyMarkers.push(h))},this.setCurrentPlace=function(b){var c=a.defaultMarkers[b];a.currentBigMarker!==c&&(c.marker.setIcon("https://maps.google.com/mapfiles/ms/icons/red-dot.png"),""!==a.currentBigMarker&&a.currentBigMarker.marker.setIcon("https://maps.google.com/mapfiles/ms/icons/blue-dot.png"),a.showInfo(c.marker,c.location.name),a.currentBigMarker=c,viewModel.clearPlaces(),a.searchPlacesByArea(c.location,500),viewModel.setCurrentPlace(c.location))},this.getNearbyMarkers=function(){return a.nearbyMarkers},this.setBounds=function(){var b=a.getNearbyMarkers(),c=new google.maps.LatLngBounds;b.forEach(function(a){c.extend(a.position)}),a.map.fitBounds(c)},this.getPlaces=function(b,c,d,e){d=void 0===viewModel.placeType()?"restaurant":viewModel.placeType().key,request={location:{lat:b.lat,lng:b.lng},radius:c,type:d},a.nearbyMarkers.length>0&&a.nearbyMarkers.forEach(function(a){a.setMap(null)}),a.nearbyPlaces=[],a.nearbyMarkers=[],a.service.nearbySearch(request,function(f,g){if(g===google.maps.places.PlacesServiceStatus.OK)if(f.length<10&&c<3e3)a.getPlaces(b,c+=500,d);else{for(var h=f.length>10?10:f.length,i=0;i<h;i++)f[i].index=i,a.nearbyPlaces.push(f[i]),a.createMarker(f[i],e,"small");a.setBounds(),viewModel.changeNearbyPlaces(a.nearbyPlaces),a.nearbyPlaces.forEach(function(b){$("#nearby-places-"+b.index).on("shown.bs.collapse",function(){a.currentNearbyPlace.index==b.index||(a.currentNearbyPlace.index!=b.index?(a.showInfo(a.nearbyMarkers[b.index],b.name),a.activateCurrentMarker(b.index),a.changeOldMarker(a.currentNearbyPlace)):void 0===a.currentNearbyPlace.index&&(a.showInfo(a.nearbyMarkers[b.index],b.name),a.activateCurrentMarker(b.index),a.changeOldMarker(a.currentNearbyPlace)))})})}else c<3e3&&a.getPlaces(b,c+=500,d)}),weather.currentLatLngWeather(b)},this.toggleNearbyCollapse=function(b){""!==a.currentNearbyPlace&&a.currentNearbyPlace.button.collapse(b)},this.showInfo=function(b,c){a.infoWindow.marker=b,a.infoWindow.setContent(c),a.infoWindow.maxWidth=500,a.infoWindow.open(a.map,b)}}var gMap,initMap=function(){gMap=new Map,gMap.initMap()},gMapsErrorHandler=function(){alert("Could not load map, sorry about that. Please try refreshing the page.")};