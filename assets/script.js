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
                const cityName = getCityNameFromResults(results);
                $("#locationInput").val(cityName);
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
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
  });

  $("#locationInput").on("enter", function() {
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

function getCityNameFromResults(results) {
  console.log(results)
  for (let i = 0; i < results.length; i++) {
    for (let j = 0; j < results[i].address_components.length; j++) {
      const cityName = results[i].address_components[j].cityName;
      if (cityName.includes("locality") || cityName.includes("sublocality")) {
        return results[i].address_components[j].long_name;
      }
    }
  }
  return "";
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
async function fetchData() {
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer DHlMvdIxJ3GkiJb-JvdUfVgar7Z2K_XQoqd5TP9z9x3_jDtZsH2-H6ss7DWllpBUE79UFsxLoNfebBjQFgPDjObq3upq-sC9Apvp3jZ87s-ASl2ns3_tPOsTjK1-ZHYx',
      'Content-Type': 'application/json',
    }
  };

  const response = await fetch('https://api.yelp.com/v3/businesses/search?latitude=34.053691&longitude=-118.242767&categories=Bars&sort_by=rating&limit=5', options);
  const data = await response.json();

  console.log(data);
}

fetchData();