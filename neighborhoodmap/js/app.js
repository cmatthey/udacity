var map;
var markers = {};

var setMap = function(map) {
  Object.keys(markers).forEach(function(key){
    markers[key].setMap(map);
  });
};

var setNeighborhoodMarker = function(title, lat, lng) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    metadata : {title: title},
    animation: google.maps.Animation.DROP
  });
  var infowindow = new google.maps.InfoWindow({
    content: '<div>' + marker.metadata.title + '</div>'
  });
  google.maps.event.addListener(marker, 'click', function() {
    yelpfusionapi(title);
    map.setCenter(marker.getPosition());
    infowindow.open(map, marker) + marker.setAnimation(google.maps.Animation.BOUNCE);
  });
  google.maps.event.addListener(map, 'center_changed', function() {
    marker.setAnimation(null);
  });
  return marker;
};

var addMarkers = function(marker) {
  markers[marker.metadata.title] = marker;
};

var removeMarkers = function() {
  setMap(null);
  markers = {};
};

var locations = function() {};
locations.schools = [
  {title: 'R.I. Meyerholz Elementary School', location: {lat: 37.3064996, lng: -122.0286182}},
  {title: 'Eaton Elementary School', location: {lat: 37.3150976, lng: -122.0283705}},
  {title: 'John Muir Elementary School', location: {lat: 37.2999103, lng: -122.0547888}},
  {title: 'William Faria Elementary School', location: {lat: 37.3166988, lng: -122.0353406}},
  {title: 'Nelson S. Dilworth Elementary School', location: {lat: 37.3064309, lng: -122.0102763}},
  {title: 'Sedgwick Elementary School', location: {lat: 37.3154064, lng: -122.0107286}}
];
locations.groceries = [
  {title: 'Trader Joe\'s', location: {lat: 37.3220587, lng: -122.1035739}},
  {title: '99 Range Market', location: {lat: 37.32191, lng: -122.0510434}},
  {title: 'Sprouts farmers market', location: {lat: 37.3218729, lng: -122.0357225}}
];
locations.parks = [
  {title: 'Jollyman Park', location: {lat: 37.3102855, lng: -122.0418191}},
  {title: 'Wilson Park', location: {lat: 37.3190182, lng: -122.0223567}}
];
locations.all = locations.schools.concat(locations.groceries).concat(locations.parks);
var centerLatLng = {lat: 37.3083685, lng: -122.0316045};
var centerLocation = {title: 'Center', location: {lat: 37.3083685, lng: -122.0316045}};

var ViewModel = function() {
  self = this;
  this.categories = ko.observableArray();
  this.categories.push(new Category('all', locations.all));
  this.categories.push(new Category('schools', locations.schools));
  this.categories.push(new Category('groceries', locations.groceries));
  this.categories.push(new Category('parks', locations.parks));
  this.selectedCategory = ko.observable();

  this.showMarkers = function() {
    var myLocations = locations.all;
    var myCategory = $('#category option:selected').text();
    if (myCategory) {
      myLocations = locations[myCategory];
    }
    removeMarkers();
    myLocations.forEach(function(item) {
      var markerToBeAdded = setNeighborhoodMarker(item.title, item.location.lat, item.location.lng);
      addMarkers(markerToBeAdded);
    });
    setMap(map);
  };

  var initialize = function() {
    var lat = 37.3083685;
    var lng = -122.0316045;
    latlng = new google.maps.LatLng(lat, lng);
    var mapOptions = {
      zoom: 13,
      center: latlng
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    // Setting initial Markers
    locations.all.forEach(function(item) {
      var markerToBeAdded = setNeighborhoodMarker(item.title, item.location.lat, item.location.lng);
        addMarkers(markerToBeAdded);
      });
    setMap(map);
  };
  google.maps.event.addDomListener(window, 'load', initialize);

  console.log('run initialize');
};

var Category = function(category, data) {
  self = this;
  self.category = category;
  self.titles = ko.observableArray();
  self.POIs = ko.observableArray();
  data.forEach(function(item) {
    self.titles.push(item.title);
    self.POIs.push(new POI(item.title, item.location.lat, item.location.lng));
  });
};

var POI = function(title, lat, lng) {
  // NOTE: this line will cause failure
  // self = this;
  this.title = ko.observable(title);
  this.lat = ko.observable(lat);
  this.lng = ko.observable(lng);
  this.show = function() {
    Object.keys(markers).forEach(function(key){
      if (title == markers[key].metadata.title) {
        console.log('title ' + title + 'metadata ' + markers[key].metadata.title);
        markers[key].setAnimation(google.maps.Animation.BOUNCE);
      } else {
        markers[key].setAnimation(null);
      }
    });
  }
};

var CLIENT_ID = '534942046014-6ar5r7rf1upb42vvi8c2uq684c5ccn1g.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBxReswLQlZaQwi0NIQeZ35mPTRniIMfdE';
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
 gapi.client.init({
   apiKey: API_KEY,
   clientId: CLIENT_ID,
   discoveryDocs: DISCOVERY_DOCS,
   scope: SCOPES
 }).then(function () {
   gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
   updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
   authorizeButton.onclick = handleAuthClick;
   signoutButton.onclick = handleSignoutClick;
 });
}

function updateSigninStatus(isSignedIn) {
 if (isSignedIn) {
   authorizeButton.style.display = 'none';
   signoutButton.style.display = 'block';
   getStars();
 } else {
   authorizeButton.style.display = 'block';
   signoutButton.style.display = 'none';
 }
}

function handleAuthClick(event) {
 gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
 gapi.auth2.getAuthInstance().signOut();
}

function getStars() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '12VUUhUfh5m9D07C81lng48W63XLMGk80TgKnXIlPdkU',
    range: 'Star Data!A1:B11',
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      console.log('range.values.length:' + range.values.length);
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        // Print columns A and E, which correspond to indices 0 and 4.
        console.log(row[0] + ', ' + row[1]);
      }
    } else {
      console.log('No data found.');
    }
  }, function(response) {
    console.log('Error: ' + response.result.error.message);
  });
}

// var yelpfusionapi = function(title) {
//   $.ajax({
//     'url': 'http://api.yelp.com/v3/businesses/search?location=cupertino&term=' + title.replace(' ', '-'),
//     'type': 'GET',
//     'cached': true,
//     'dataType': 'jsonp',
//     'beforeSend': function(request) {
//     request.setRequestHeader("Authorization", 'Bearer rHe09HCWMdvjVVL0J6pNOD-Kq2qFY3-25ug1r1qBC1zJ9sy6YOnOZEescdALflvX0ngJwamZO4yFaeVeM9WBEzkFZl5EY47kyE32vghDhMl9ny0ykmDTWxGnSBebWnYx');
//     },
//     'headers': {'Authorization': 'Bearer rHe09HCWMdvjVVL0J6pNOD-Kq2qFY3-25ug1r1qBC1zJ9sy6YOnOZEescdALflvX0ngJwamZO4yFaeVeM9WBEzkFZl5EY47kyE32vghDhMl9ny0ykmDTWxGnSBebWnYx'},
//     'jsonpCallback': 'cb',
//     'success': function(data, textStats, XMLHttpRequest) {
//       console.log('yelp success');
//     }
//   }).fail(function(e) {
//     console.log(function(e) {e.error()});
//   });
// };

$.ajaxSetup({
  'cache': true
});

ko.applyBindings(new ViewModel());
