var map;
var markers = {};
var info = {};
var trafficData;

var setMap = function(map) {
  Object.keys(markers).forEach(function(key){
    markers[key].setMap(map);
  });
};

var setNeighborhoodMarker = function(title, lat, lng) {
  callmapquestapi(lat, lng);
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    metadata : {title: title},
    animation: google.maps.Animation.DROP
  });
  var infowindow = new google.maps.InfoWindow({
    content: '<div>' + marker.metadata.title + ' ' + trafficData  + '</div>'
  });
  google.maps.event.addListener(marker, 'click', function() {
    map.setCenter(marker.getPosition());
    infowindow.setContent('<div>' + marker.metadata.title + ' ' + trafficData  + '</div>');
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

// var locations = function() {};
// locations.schools = [
//   {title: 'R.I. Meyerholz Elementary School', location: {lat: 37.3064996, lng: -122.0286182}},
//   {title: 'Eaton Elementary School', location: {lat: 37.3150976, lng: -122.0283705}},
//   {title: 'John Muir Elementary School', location: {lat: 37.2999103, lng: -122.0547888}},
//   {title: 'William Faria Elementary School', location: {lat: 37.3166988, lng: -122.0353406}},
//   {title: 'Nelson S. Dilworth Elementary School', location: {lat: 37.3064309, lng: -122.0102763}},
//   {title: 'Sedgwick Elementary School', location: {lat: 37.3154064, lng: -122.0107286}}
// ];
// locations.groceries = [
//   {title: 'Trader Joe\'s', location: {lat: 37.3220587, lng: -122.1035739}},
//   {title: '99 Range Market', location: {lat: 37.32191, lng: -122.0510434}},
//   {title: 'Sprouts farmers market', location: {lat: 37.3218729, lng: -122.0357225}}
// ];
// locations.parks = [
//   {title: 'Jollyman Park', location: {lat: 37.3102855, lng: -122.0418191}},
//   {title: 'Wilson Park', location: {lat: 37.3190182, lng: -122.0223567}}
// ];
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
var callmapquestapi = function(lat, lng) {
  var MAPQUEST_KEY = '9D2Z2jPEHDwUTp0Lc2kqQUPXb0rSbfxG';
  var bindingbox = lat + ',' + lng + ','
                 + (parseFloat(lat) + 1) + ',' + (parseFloat(lng) + 1);
  var url = 'https://www.mapquestapi.com/traffic/v2/incidents?outFormat=json&boundingBox=' + bindingbox + '&key=' + MAPQUEST_KEY;
  $.getJSON(url, function(data) {
    var incidents = data.incidents;
    var myTrafficData;
    if (incidents.length > 0) {
      myTrafficData = incidents[0].fullDesc;
    } else {
      myTrafficData = '';
    }
    console.log('trafficData '+ myTrafficData);
    // Traffic data does not pass to InfoWindow
    trafficData = myTrafficData;
  });
};

$.ajaxSetup({
  'cache': true
});

ko.applyBindings(new ViewModel());
