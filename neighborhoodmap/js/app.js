var map;

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
var initMap = function() {
  var lat = 37.3083685;
  var lng = -122.0316045;
  latlng = new google.maps.LatLng(lat, lng);
  var mapOptions = {
    zoom: 13,
    center: latlng
  };
  console.log('trying to init map');
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  console.log('trying to init map after');
};

var ViewModel = function() {
  self = this;
  this.categories = ko.observableArray();
  this.categories.push(new Category('all', locations.all));
  this.categories.push(new Category('schools', locations.schools));
  this.categories.push(new Category('groceries', locations.groceries));
  this.categories.push(new Category('parks', locations.parks));
  this.selectedCategory = ko.observable();

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

  this.showMarkers = function() {
    console.log('in showMarkers');
  };
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
    var marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(lat, lng),
      animation: google.maps.Animation.DROP
    });
    console.log('title: ' + title);
    console.log('lat: ' + lat);
    console.log('lng: ' + lng);
  }
};

ko.applyBindings(new ViewModel());
