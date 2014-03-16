var App = {};

$( "document" ).ready( function() {

  App.setEventListeners();
  navigator.geolocation.getCurrentPosition(function(position){
    App.lat = position.coords.latitude;
    App.lng = position.coords.longitude;
    App.makeMap();

    var input = document.getElementById('pac-input');
    App.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = App.search(input);


    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(App.map, 'bounds_changed', function() {
      var bounds = App.map.getBounds();
      searchBox.setBounds(bounds);
    });

  });

});

App.watchUser = function(user_id) {
  var user_id = user_id;
  navigator.geolocation.watchPosition(function(position){
    var userUpdate = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    $.ajax({
      type: "PUT",
      url: "/users/" + user_id,
      data: {user: userUpdate},
      dataType: "json"
    }).done(function(user){

      console.log(user);
      App.dropPin(user.lat, user.lng);
    });
  });
};




// navigator.geolocation.watchPosition(function(position){
// console.log(position)
// })

App.setEventListeners = function() {
  $("form").on("submit", App.createUser);
  $("#drop-pin").on("click", App.dropPin);

};


App.makeMap = function() {
  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(App.lat, App.lng),
      // mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    App.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);


  };



  App.search = function(input) {

  //  #TODO NEED TO CLEAR UP MARKER VARIABLE NAME TO CLEAN UP WORKSPACE


    var infoTemplate = Handlebars.compile($("#template-window").html());

    var markers = [];
    var map = App.map;

    var autocomplete = new google.maps.places.Autocomplete(input);


    var searchBox = new google.maps.places.SearchBox(
      /** @type {HTMLInputElement} */(input));

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
      var places = searchBox.getPlaces();
      // The places var is an array of things that will get placed by markers
      console.log(places);
      // loop through this to see what I'm getting
      for (var i = 0, marker; i < markers.length; i++){
        marker = markers[i];
        marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
    // for (var i = 0, i < places.length ; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // console.log("setting up infowindow " + i);
      var infoWindow = new google.maps.InfoWindow({
        content: infoTemplate({i:i, name: place.name, address: place.formatted_address}),
        maxWidth: 400,
      });
      infoWindow.i = i;

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: App.map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function(){
        infoWindow.open(App.map, marker);
          var subinput = document.getElementById("pac-input-" + infoWindow.i);
          App.search(subinput);
        // bias to nearby results
      });

      console.log(markers);
      console.log(places);
      markers.push(marker);


      bounds.extend(place.geometry.location);
    }

    App.map.fitBounds(bounds);
  });

return searchBox;


};


