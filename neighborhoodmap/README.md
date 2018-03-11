Udacity Project: Neighborhood Map
=====================================

How to load and view the App
=============================
To run the app just visit: http://cmatthey.github.io/neighborhoodmap <br>.
Or it can be run locally by git clone  https://github.com/cmatthey/udacity.
Set up a local server with the following command
Python 3:
python -m http.server 8080
Python 2:
python -m SimpleHTTPServer 8080
Use a browser to open https://localhost:8000/cmatthey/udacity/tree/master/neighborhoodmap/index.html.
Search near by schools, groceries, and parks in my neighborhood.


What the project is about
==========================
The map displays Search near by schools, groceries, and parks.
To display the location of each category, select a category from the dropdown.  

Once you select a category the following happens:

1. Map will display the markers of all the Point of Interests for that category.

2. Click on the Marker will show InfoWindow.

3. Click on a POI below the dropdown in the list view will bounce the Marker.



What I did
===================


App Functionality
-----------------
Each of the following application components function without error:
- Filter Locations
- List View
- Map Markers, and InfoWindows



App Architecture
----------------
The code is separated based upon Knockout's best practices. It also uses Google Map APIs.



Credits:
====================================

Google Map <br>
------------------------
JQuery <br>
------------------------
Bootstrap<br>
-----------------------
MapQuest<br>
-----------------------
