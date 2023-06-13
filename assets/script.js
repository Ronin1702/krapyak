const goBtn = document.getElementById('goBtn');
let rowContent = document.querySelector('#outputContent');
let locationInput = document.querySelector('#locationInput');


// API keys
const googleApiKey = "AIzaSyBhYfGeciSa00nbDY9OZNDpJPs5gKYymH4";
// const yelpApiKey = "DHlMvdIxJ3GkiJb-JvdUfVgar7Z2K_XQoqd5TP9z9x3_jDtZsH2-H6ss7DWllpBUE79UFsxLoNfebBjQFgPDjObq3upq-sC9Apvp3jZ87s-ASl2ns3_tPOsTjK1-ZHYx";
// const url = 'https://api.yelp.com/v3/businesses/search?location=sanfrancisco&term=pizza';


// the two urls used, I noticed as long as you got initMap in the callback it doesn't matter which one I use
function loadGoogleMapsApi(callbackInitMap) { //here I write a function to loadGoogleMapApi and append it to head
  $("<script />", { //the argument callbackInitMap has a value of 'initMap' when this function is called.
    src: `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places&callback=${callbackInitMap}`,
    defer: true, //defer method to load better by loading after the our document is parsed but before DOMContentLoaded
    async: true // use async to tell the browser to load the script as soon as it become available
  }).appendTo("head");

};

loadGoogleMapsApi("initMap"); // call the fuinction where 'initMap' is the argument that for the callback function.
//below is where the script populate the map window and pop up a window saying 'Location Found' within the map area when the location is found.

// below I pretty much copied from google map api doc
let map, infoWindow;

function initMap() { //write a function for initMap as indicated in the url tag
  map = new google.maps.Map($("#map")[0], {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 6,
  });
  infoWindow = new google.maps.InfoWindow();

  let autocomplete = new google.maps.places.Autocomplete($("#locationInput")[0], {
    cityName: ["(cities)"]
  });

  // Add an event listener to the autocomplete object for the "place_changed" event.
  autocomplete.addListener("place_changed", function () {
    // Get the selected place from the autocomplete object.
    const place = autocomplete.getPlace();

    // If the place is not null, set the map's center to the place's location.
    if (place != null) {
      map.setCenter(place.geometry.location);

      // Create a new marker object.
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
      });
    }
  });

  $("#getCityBtn").click(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Current Location");
          infoWindow.open(map);
          map.setCenter(pos);

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results, status) => {
            if (status === "OK") {
              if (results[0]) {
                const cityNameState = getCityStateFromResults(results);
                $("#locationInput").val(cityNameState);
              } else {
                console.log("No results found");
              }
            } else {
              console.log("Geocoder failed due to: " + status);
            }
          });
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  $("#goBtn").click(() => {
    // Get the input from the user
    const input = $("#locationInput").val();

    // Create a new geocoder object
    const geocoder = new google.maps.Geocoder();

    // Geocode the input
    geocoder.geocode({ address: input }, (results, status) => {
      if (status === "OK") {
        // Get the first result
        const result = results[0];

        // Get the latitude and longitude
        const lat = result.geometry.location.lat();
        const lng = result.geometry.location.lng();

        // Set the map's center to the latitude and longitude
        map.setCenter({ lat, lng });
        const marker = new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: map,
        });
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
  });

  $("#locationInput").on("enter", function () {
    // Get the input from the user
    const input = $("#locationInput").val();

    // Create a new geocoder object
    const geocoder = new google.maps.Geocoder();

    // Geocode the input
    geocoder.geocode({ address: input }, (results, status) => {
      if (status === "OK") {
        // Get the first result
        const result = results[0];

        // Get the latitude and longitude
        const lat = result.geometry.location.lat();
        const lng = result.geometry.location.lng();

        // Set the map's center to the latitude and longitude
        map.setCenter({ lat, lng });
        const marker = new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: map,
        });
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
  });

  $('#locationInput').on('keypress', function (event) {
    if (event.which === 13 && $("#locationInput").is(":focus")) {
      event.preventDefault();
      const input = $("#locationInput").val();

      // Create a new geocoder object
      const geocoder = new google.maps.Geocoder();

      // Geocode the input
      geocoder.geocode({ address: input }, (results, status) => {
        if (status === "OK") {
          // Get the first result
          const result = results[0];

          // Get the latitude and longitude
          const lat = result.geometry.location.lat();
          const lng = result.geometry.location.lng();

          // Set the map's center to the latitude and longitude
          map.setCenter({ lat, lng });
        } else {
          console.log("Geocoder failed due to: " + status);
        }
      });
    }
  });

}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function getCityStateFromResults(results) {
  let city, state;

  for (let i = 0; i < results[0].address_components.length; i++) {
    if (results[0].address_components[i].types.includes('locality')) {
      city = results[0].address_components[i].long_name;
    }
    if (results[0].address_components[i].types.includes('administrative_area_level_1')) {
      state = results[0].address_components[i].short_name;
    }
  }
  
  return city && state ? city + ', ' + state : '';
}

window.initMap = initMap; //call the initMap function within a given window

// the jQuery below kicks on when DOMContentLoaded
$(document).ready(() => {
  $("#hotels").click(() => {
    $("#hotelLists").removeClass("d-none").addClass("d-block");
    $("#restaurantLists").removeClass("d-block").addClass("d-none");
  });

  $("#restaurants").click(() => {
    $("#hotelLists").removeClass("d-block").addClass("d-none");
    $("#restaurantLists").removeClass("d-none").addClass("d-block");
  });
});

// Write a function to get the city or location input:
function getRearchInput() {
  const searchInput = document.getElementById('locationInput').value;

  // fetch request from Yelp Fusion API:
  var yelpHeaders = new Headers();
  // myHeaders.append("XvfCGGhClD2Ru5otL6JPCW7dq0UbW_GqNmFDuoR7UJokbxfVPY708rQI54HNgXkSUTm4FWgd3C6zzavgV81AYuMawvDNESAvB6Uz3fsj56TDJk5togcwRKErnX2CZHYx", "");
  elpHeaders.append("Authorization", "Bearer XvfCGGhClD2Ru5otL6JPCW7dq0UbW_GqNmFDuoR7UJokbxfVPY708rQI54HNgXkSUTm4FWgd3C6zzavgV81AYuMawvDNESAvB6Uz3fsj56TDJk5togcwRKErnX2CZHYx");

  var requestOptions = {
    method: 'GET',
    headers: yelpHeaders,
    redirect: 'follow'
  };
  // 10 results starting after the 989th. 
  // fetch restaurant json
  fetch("https:/cors-anywhere.herokuapp.com/api.yelp.com/v3/businesses/search?location=" + searchInput + "&categories=restaurants&radius=40000&sort_by=rating&limit=10&offset=989", requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

document.getElementById('goBtn').addEventListener('click', getRearchInput);
