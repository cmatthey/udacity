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
        console.log('title ' + title + 'metadata ' + marker[key].metadata.title);
        item.setAnimation(google.maps.Animation.BOUNCE);
      } else {
        item.setAnimation(null);
      }
    });
  }
};

var yelpapi = function(terms, location) {
  var auth = {
    consumerKey: "WaEtHKEo4ZZd4eDcOWnTWA",
    consumerSecret: "8eEcMiXq3m2LJp1tQQFkSSS2Avw",
    accessToken: "J-rfdsYzCK0IPwNAfiHScUmMkIT6V_lH",
    accessTokenSecret: "T46e74WAJo-6GkC6Od7w8ftt4MQ",
    serviceProvider: {
      signatureMethod: "HMAC-SHA1"
    }
  };
  var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
  };
  var parameters = [];
  parameters.push(['term', terms]);
  parameters.push(['location', location]);
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
  var message = {
    'action': 'http://api.yelp.com/v2/search',
    'method': 'GET',
    'parameters': parameters
  };
  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);
  var parameterMap = OAuth.getParameterMap(message.parameters);
  $.ajax({
    'url': message.action,
    'data': parameterMap,
    'cached': true,
    'dataType': 'jsonp',
    'jsonpCallback': 'cb',
    'success': function(data, textStats, XMLHttpRequest) {
      removeMarkers();
      self.listings.removeAll();
      console.log(data);
      var len = data.businesses.length;
      for (var i = 0; i < len; i++) {
        self.listings.push(new ListElements(data.businesses[i]));
      }
      console.log(self.listings());
      showMarkers();
    }
  }).fail(function(e) {
    console.log('Opps the Burger Map turned the wrong way.');
    console.log(e.error());
  });
};

var yelpsearchapi = function() {

};

$.ajaxSetup({
  'cache': true
});

ko.applyBindings(new ViewModel());
