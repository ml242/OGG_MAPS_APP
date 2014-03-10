var App = {};
// var App.map;

$( "document" ).ready( function() {
  App.setEventListeners();
  navigator.geolocation.getCurrentPosition(function(position){
    App.lat = position.coords.latitude;
    App.lng = position.coords.longitude;
    App.makeMap();
  });
  App.search();

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

// App.createUser = function(e) {
//   e.preventDefault();
//   var newUser = {
//     name: $("#user_name").val(),
//     email: $("#user_email").val(),
//     lat: App.lat,
//     lng: App.lng
//   };

//   $.ajax({
//     type: "POST",
//     url: "/users",
//     data: {user: newUser},
//     dataType: "json"
//   }).done( function(data) {
//       $("form").trigger("reset");
//       $("#notice").css("display", "inline");
//       $("#notice").text("User " + data.name + " was created!");
//       $("#notice").fadeOut();
//       App.watchUser(data.id);
//       App.dropPin(data.lat, data.lng);
//     });
// };

App.makeMap = function() {
  var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(App.lat, App.lng),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
  App.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);


};


App.dropPin = function(lat, lng) {
  var myLatlng = new google.maps.LatLng(lat,lng);
  var marker = new google.maps.Marker({
    position: myLatlng,
    title:"Hello World!"
  });
  marker.setMap(App.map);
};


App.search = function() {

  var markers = [];
  var map = App.map;


  var input = document.getElementById('pac-input');
  var autocomplete = new google.maps.places.Autocomplete(input);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: App.map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    App.map.fitBounds(bounds);
  });

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  // App.event.addListener(map, 'bounds_changed', function() {
  //   var bounds = App.map.getBounds();
  //   searchBox.setBounds(bounds);
  // });
}

// App.maps.event.addDomListener(window, 'load', initialize);

  // var input = document.getElementById('pac-input');
  // var autocomplete = new google.maps.places.Autocomplete(input);

  // google.maps.event.addListener(autocomplete, 'place_changed', function() {
  //   infowindow.close();
  //   marker.setVisible(false);
  //   input.className = '';
  //   var place = autocomplete.getPlace();
  //   if (!place.geometry) {
  //     // Inform the user that the place was not found and return.
  //     input.className = 'notfound';
  //     return;
  //   }

  //   var address = '';
  //   if (place.address_components) {
  //     address = [
  //       (place.address_components[0] && place.address_components[0].short_name || ''),
  //       (place.address_components[1] && place.address_components[1].short_name || ''),
  //       (place.address_components[2] && place.address_components[2].short_name || '')
  //     ].join(' ');
  //   }

  //   infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);

  // });
  
  // setupClickListener('changetype-geocode', ['geocode']);






