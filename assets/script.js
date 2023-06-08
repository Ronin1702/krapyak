$(document).ready(function () { //I added document ready function for jQuery purposes

  let map, infoWindow;
  const googleApiKey = "AIzaSyBhYfGeciSa00nbDY9OZNDpJPs5gKYymH4";
  const initMapUrl = "https://maps.googleapis.com/maps/api/js?key=" + googleApiKey + "callback=initMap";
  const autocompleteUrl = "https://maps.googleapis.com/maps/api/js?key=" + googleApiKey + "&libraries=places&callback=initMap";

  function initMap() {
    // Below I fetch the initMapUrl from here instead of html:
    fetch(initMapUrl)
      .then(response => response.text())
      .then(script => {
        // Execute the fetched script by creating a new script element
        const scriptElement = document.createElement("script");
        scriptElement.innerHTML = script;
        document.body.appendChild(scriptElement);
      })
      .catch(error => {
        console.error("Failed to fetch initMapUrl:", error);
      });

    // Fetch the autocompleteUrl script
    fetch(autocompleteUrl)
      .then(response => response.text())
      .catch(error => {
        console.error("Failed to fetch autocompleteUrl:", error);
      });

    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 6,
    });
    infoWindow = new google.maps.InfoWindow();

    const getCityBtn = document.getElementById("getCityBtn");
    const cityInput = document.getElementById("locationInpput");

    let autocomplete = new google.maps.places.Autocomplete(cityInput, {
      types: ["(cities)"]
    });

    getCityBtn.addEventListener("click", () => {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent("Location found.");
            infoWindow.open(map);
            map.setCenter(pos);

            // Get city name based on coordinates
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: pos }, (results, status) => {
              if (status === "OK") {
                if (results[0]) {
                  const cityName = getCityNameFromResults(results);
                  cityInput.value = cityName;
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
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
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
    for (let i = 0; i < results.length; i++) {
      for (let j = 0; j < results[i].address_components.length; j++) {
        const types = results[i].address_components[j].types;
        if (types.includes("locality") || types.includes("sublocality")) {
          return results[i].address_components[j].long_name;
        }
      }
    }
    return "";
  }

  window.initMap = initMap;

  // When a drop down menu option is selected, the right card class is displayed, otherwise hidden.
  document.addEventListener("DOMContentLoaded", () => {
    const hotelOption = document.getElementById("hotels");
    const restaurantOption = document.getElementById("restaurants");
    const hotelCard = document.getElementById("hotelLists");
    const restaurantCard = document.getElementById("restaurantLists");

    hotelOption.addEventListener("click", () => {
      hotelCard.classList.add("d-block");
      hotelCard.classList.remove("d-none");
      restaurantCard.classList.add("d-none");
      restaurantCard.classList.remove("d-block");
    });

    restaurantOption.addEventListener("click", () => {
      hotelCard.classList.add("d-none");
      hotelCard.classList.remove("d-block");
      restaurantCard.classList.add("d-block");
      restaurantCard.classList.remove("d-none");
    });
  });

})
