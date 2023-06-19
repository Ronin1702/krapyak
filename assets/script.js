const goBtn = document.getElementById('goBtn');
// base on https://docs.developer.yelp.com/docs/resources-categories, some categoryList needs lower case
let categoryList = ["Parks", "Restaurants", "Hotels", "Coffee", "Farmersmarket", "Bars", "Nightlife"];
let locationInput = document.querySelector('#locationInput');
// Get a reference to the 'categoryInput' and 'listHeader' element
let categoryInput = document.querySelector('#categoryInput');
let listHeader = document.querySelector('#listHeader');
let images = document.querySelectorAll('.top-city-img');
function capitalizeEachWord(str) { //uppercase first letter of each word
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function picLocation(element) {
  var locaInfo = element.querySelector('img').getAttribute('alt');
  return locaInfo;
}

document.addEventListener('DOMContentLoaded', function () {
  images.forEach(function (image) {
    image.addEventListener('click', hidePics);
    image.addEventListener('click', function () {
      locationInput.value = picLocation(this);
      // set categoryInput randomly picked up from array of categoryList 
      categoryInput.value = categoryList[Math.floor(Math.random() * categoryList.length)];
      $("#goBtn").click();
      console.log(locationInput);
    });
  });
});
// API keys
const googleApiKey = "AIzaSyBhYfGeciSa00nbDY9OZNDpJPs5gKYymH4";

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
    center: { lat: 39.9833, lng: -82.9833 },
    zoom: 12,
  });
  $("#biz1").click(function () {
    // Parse the bizLocations array from localStorage
    var bizLatitude = JSON.parse(localStorage.getItem('bizLat'));
    var bizLongitude = JSON.parse(localStorage.getItem('bizLng'));

    map = new google.maps.Map($("#map")[0], {
      center: { lat: bizLatitude[0], lng: bizLongitude[0] },
      zoom: 18,
    });
    const marker = new google.maps.Marker({
      position: { lat: bizLatitude[0], lng: bizLongitude[0] },
      map: map,
    });
  });
  $("#biz2").click(function () {
    // Parse the bizLocations array from localStorage
    var bizLatitude = JSON.parse(localStorage.getItem('bizLat'));
    var bizLongitude = JSON.parse(localStorage.getItem('bizLng'));

    map = new google.maps.Map($("#map")[0], {
      center: { lat: bizLatitude[1], lng: bizLongitude[1] },
      zoom: 18,
    });
    const marker = new google.maps.Marker({
      position: { lat: bizLatitude[1], lng: bizLongitude[1] },
      map: map,
    });
  });
  $("#biz3").click(function () {
    // Parse the bizLocations array from localStorage
    var bizLatitude = JSON.parse(localStorage.getItem('bizLat'));
    var bizLongitude = JSON.parse(localStorage.getItem('bizLng'));

    map = new google.maps.Map($("#map")[0], {
      center: { lat: bizLatitude[2], lng: bizLongitude[2] },
      zoom: 18,
    });
    const marker = new google.maps.Marker({
      position: { lat: bizLatitude[2], lng: bizLongitude[2] },
      map: map,
    });
  });
  $("#biz4").click(function () {
    // Parse the bizLocations array from localStorage
    var bizLatitude = JSON.parse(localStorage.getItem('bizLat'));
    var bizLongitude = JSON.parse(localStorage.getItem('bizLng'));

    map = new google.maps.Map($("#map")[0], {
      center: { lat: bizLatitude[3], lng: bizLongitude[3] },
      zoom: 18,
    });
    const marker = new google.maps.Marker({
      position: { lat: bizLatitude[3], lng: bizLongitude[3] },
      map: map,
    });
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
// Write a function to get the city or location input:
function getSearchInput() {
  localStorage.clear();  // clear local storage
  const searchInput = document.getElementById('locationInput').value;
  var newCategoryInput = categoryInput.value.replace(/\s/g, '').toLowerCase();
  console.log(newCategoryInput)

  // fetch request from Yelp Fusion API:
  var yelpHeaders = new Headers();
  yelpHeaders.append("Authorization", "Bearer XvfCGGhClD2Ru5otL6JPCW7dq0UbW_GqNmFDuoR7UJokbxfVPY708rQI54HNgXkSUTm4FWgd3C6zzavgV81AYuMawvDNESAvB6Uz3fsj56TDJk5togcwRKErnX2CZHYx");

  var requestOptions = {
    method: 'GET',
    headers: yelpHeaders,
    redirect: 'follow'
  };
  // fetch restaurant json
  fetch("https:/cors-anywhere.herokuapp.com/api.yelp.com/v3/businesses/search?location=" + searchInput + "&categories=" + newCategoryInput + "&sort_by=rating", requestOptions)// we do not set an offet value to 1000 here because some of them are less than 1000.
    .then(response => response.json())
    .then(result => {
      console.log('Result:', result);
      let totalArray = result.total
      console.log('totalArray:', totalArray)
      localStorage.setItem('totalArray', totalArray)//store total array in localStorage
      // conditional (ternary) operator: If the arry is less then 1000 then use totalArray -5, if not  :  then use 1000-5.
      let offsetArray = totalArray < 1000 ? totalArray - 5 : 1000 - 5;
      console.log('Update offsetArray:', offsetArray)
      // fetch request from Yelp Fusion API:
      var yelpHeaders = new Headers();
      yelpHeaders.append("Authorization", "Bearer XvfCGGhClD2Ru5otL6JPCW7dq0UbW_GqNmFDuoR7UJokbxfVPY708rQI54HNgXkSUTm4FWgd3C6zzavgV81AYuMawvDNESAvB6Uz3fsj56TDJk5togcwRKErnX2CZHYx");

      var requestOptions = {
        method: 'GET',
        headers: yelpHeaders,
        redirect: 'follow'
      };
      // Perform a new fetch operation using the offset parameter
      fetch("https:/cors-anywhere.herokuapp.com/api.yelp.com/v3/businesses/search?location=" + searchInput + "&categories=" + newCategoryInput + "&sort_by=rating&limit=5&offset=" + offsetArray, requestOptions) //limit is 5 to the offet variable
        .then(response => response.json())
        .then(newResult => {
          console.log(newResult)
          let bizNames = newResult.businesses.map(business => business.name).reverse(); //get bizNames in reversed array order
          let bizRating = newResult.businesses.map(business => business.rating).reverse(); //get bizRating in reversed array order
          let bizUrl = newResult.businesses.map(business => business.url).reverse();
          let bizLat = newResult.businesses.map(business => business.coordinates.latitude).reverse();

          let bizLng = newResult.businesses.map(business => business.coordinates.longitude).reverse();


          localStorage.setItem('bizLat', JSON.stringify(bizLat));
          localStorage.setItem('bizLng', JSON.stringify(bizLng));
          // let bizNames = newResult.businesses.map(business => business.name); //get bizNames in default array order
          localStorage.setItem('bizNames', JSON.stringify(bizNames));
          localStorage.setItem('bizRating', JSON.stringify(bizRating));
          localStorage.setItem('bizUrl', JSON.stringify(bizUrl));

          console.log('bizNames Array Reversed:', bizNames); // To see the stored names2
          console.log('biz Rating Array Reversed:', bizRating); // To see the stored ratings
          console.log('bizUrl Array Reversed:', bizUrl);
          // Call the function to display the business results.
          displayResults();
        })
        .catch(error => console.log('error', error));
    })
    .catch(error => console.log('error', error));
}
// When the goBtn is clicked the above fetch link get the location inputs in the textbox.
document.getElementById('goBtn').addEventListener('click', getSearchInput);
document.getElementById('categoryInput').addEventListener('enter', getSearchInput)

// Append and Display the business category results in the list from localStorage
function displayResults() {
  $('#card-head').empty(); // this is to make sure that it empties the card-head before appending new info.
  var localStorageData = localStorage.getItem('bizNames');
  if (localStorageData) {
    var data = JSON.parse(localStorageData);
    var cardTitles = document.querySelectorAll('.card-title');
    for (var i = 0; i < cardTitles.length; i++) {
      cardTitles[i].textContent = data[i];
    }
  }
  // get localstorage of business ratings array and begin parsing JSON.
  var localStorageData = localStorage.getItem('bizRating');
  if (localStorageData) {
    var data = JSON.parse(localStorageData);
    var cardContent = document.querySelectorAll('.card-text');
    // function to select yelp API display requirement star rating images appropriate to cards business' yelp rating.
    function ratingToImage(rating) {
      var img = "";
      if (rating == 1) {
        img = "assets/Images/yelp-stars/small_1.png";
      } else if (rating == 1.5) {
        img = "assets/Images/yelp-stars/small_1_half.png";
      } else if (rating == 2) {
        img = "assets/Images/yelp-stars/small_2.png";
      } else if (rating == 2.5) {
        img = "assets/Images/yelp-stars/small_2_half.png";
      } else if (rating == 3) {
        img = "assets/Images/yelp-stars/small_3.png";
      } else if (rating == 3.5) {
        img = "assets/Images/yelp-stars/small_3_half.png";
      } else if (rating == 4) {
        img = "assets/Images/yelp-stars/small_4.png";
      } else if (rating == 4.5) {
        img = "assets/Images/yelp-stars/small_4_half.png";
      } else if (rating == 5) {
        img = "assets/Images/yelp-stars/small_5.png";
      } else {
        img = "assets/Images/yelp-stars/small_0.png";
      }
      return img;
    }
    // for loop that registers functions data[i] in this case rating value and updates the rating and img in card.
    for (var i = 0; i < cardContent.length; i++) {
      var img = ratingToImage(data[i]);
      cardContent[i].innerHTML = `Rating: ${data[i]} <img src="${img}" alt="Rating">`;
    }
  }

  var localStorageData = localStorage.getItem('bizUrl');
  if (localStorageData) {
    var data = JSON.parse(localStorageData);
    var cardUrl = document.querySelectorAll('.card-link');
    for (var i = 0; i < cardUrl.length; i++) {
      cardUrl[i].href = data[i];
    }
  }
  // append info to card-head
  $('#card-head').append('Displaying bottom <b>4</b> of ' + localStorage.getItem('totalArray') + ' ' + capitalizeEachWord(categoryInput.value) + ' near ' + locationInput.value)
}

// hides Daniel's suggestion pictures when clicking go button, unhides 5 card elements in same spot.
function hidePics() {
  var hidePic = document.getElementById('suggestions');
  hidePic.style.display = "none";
  var showPic = document.getElementById('showResults');
  showPic.style.display = "flex";

}

goBtn.addEventListener('click', hidePics);
categoryInput.addEventListener('keyup',  function(event) {
  if (event.keyCode === 13) {
    getSearchInput();
    hidePics();
  }
});