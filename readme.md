Udacity Front End Developer Nanodegree Neighborhood Map Project

About: 
This is the largest from-scratch project I have put together in the program, and certainly the most complex. The map uses as a base a hardcoded list of 8 locations in the Seattle area that I am fond of. When you click on one of them the app fires a Google Places search of locations within a 3KM radius (starting at 500meters and incrementing at 500meters until at least 10 locations are found or the max radius of 3KM is hit). 

Clicking on the marker or button for one of the populated nearby places will display a few stats of that location. Clicking off will reset the map to show the default 8 locations. 

There is a filter text input which will show only the default locations that match the entered string.


To Run:
Web app is located at https://spconrad.github.io/neighborhoodmap/

To run locally, download and run through a local server. Must be run through a local server due to cross-origin rules


Attributions:
This app uses the following 3rd party resourcse:
* Google Maps API
* Dark Sky Weather API
* KnockoutJS
* Bootstrap
* Jquery 
* https://gist.github.com/tbranyen's openweather icons.json file for better weather-type parsing 

Design:
This is intended as a MVVM architecture with KnockoutJS. The ViewModel in app.js handles the heavy lifting of keeping the view updated thanks to knockout. 

The Map and Weathermap are separated into their own files to for organizational purposes. The main items in the model are the defaultLocations array and nearbyList array(results from a nearbyPlaces search).
