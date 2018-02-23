var map;
var markers = [];

var setMap = function(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
};

var setNeighborhoodMarker = function(title, lat, lng) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    metadata : {title: title},
    animation: google.maps.Animation.DROP
  });
  var infowindow = new google.maps.InfoWindow({
    content: '<div>' + title + '</div>'
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map, marker) + marker.setAnimation(google.maps.Animation.BOUNCE);
    map.setCenter(marker.getPosition());
  });
  //If you leave the marker with the mouse it stops bouncing
  google.maps.event.addListener(marker, 'mouseout', function() {
    infowindow.close(map, marker) + marker.setAnimation(null);
  });
  return marker;
};

var addMarkers = function(marker) {
  markers.push(marker);
};

var removeMarkers = function() {
  setMap(null);
  markers = [];
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
    console.log('run showMarkers' + myLocations.length);
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
    markers.forEach(function(item){
      if (title == item.metadata.title) {
        console.log('title ' + title + 'metadata ' + item.metadata.title);
        item.setAnimation(google.maps.Animation.BOUNCE);
      } else {
        item.setAnimation(null);
      }
    });
    console.log('in show');
  }
};

ko.applyBindings(new ViewModel());
