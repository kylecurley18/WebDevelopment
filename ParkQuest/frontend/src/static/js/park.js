import api from './APIClient.js';
let isVisited = false; // Variable to keep track of the visited status
let distanceThreshold = 700; // Distance threshold in kilometers
const button = document.getElementById('visit-button');
button.disabled = !isVisited; // Disable the button by default

api.getParkDetails().then(parks => {
  console.log("parks ", parks);
  const parksList = document.getElementById('parks-select');
  const parstStored = localStorage.setItem('parks', JSON.stringify(parks));
  //console.log(parks);
  document.getElementById('selected-park-lat').textContent = "Park not selected";
  document.getElementById('selected-park-lng').textContent = "Park not selected";
  document.getElementById('distance-from-user').textContent = "Park not selected";

  parks.forEach(park => {
    //console.log(park);
    const parksListOption = document.createElement('option');
    parksListOption.innerHTML = park.fullName;
    parksListOption.setAttribute('value', park.fullName);
    //parksListOption.setAttribute('parkId', park.id);

    parksList.appendChild(parksListOption);


  });

  parksList.addEventListener('change', (event) => {

    const selectedParkName = event.target.value;
    //const selectedParkId = event.target;
    const park = parks.filter(park => park.fullName === selectedParkName)[0];
    console.log("parkIDIEIIEIE ", park.id);
    //console.log(parks.filter(park => park.fullName === selectedParkName));


    updateParkDetails(selectedParkName); // Call to update the map with selected park details
  });

});

// Variable to keep track of the current marker
let currentMarker = null;

// Function to update the map with details of the selected park
function updateParkDetails(selectedParkName) {

  if (selectedParkName === "all") {
    // Remove previous marker if exists
    if (currentMarker) {
      map.removeLayer(currentMarker);
      currentMarker = null; // Reset currentMarker variable
      document.getElementById('selected-park-lat').textContent = "Park not selected";
      document.getElementById('selected-park-lng').textContent = "Park not selected";
      document.getElementById('distance-from-user').textContent = "Park not selected";
      isVisited = false; // Reset the visited status

    }
    return; // Exit the function, no need to fetch details for "All National Parks"
  }

  // Fetch details of the selected park
  api.getParkDetails().then(parks => {
    const selectedPark = parks.find(park => park.fullName === selectedParkName);
    if (selectedPark) {
      const { latitude: parkLat, longitude: parkLng } = selectedPark;
      const userLat = parseFloat(document.getElementById('user-lat').textContent);
      const userLng = parseFloat(document.getElementById('user-lng').textContent);

      // Calculate distance between user's location and the selected park
      const distance = calculateDistance(userLat, userLng, parkLat, parkLng);

      // Update latitude and longitude of the selected park
      document.getElementById('selected-park-lat').textContent = parkLat;
      document.getElementById('selected-park-lng').textContent = parkLng;
      document.getElementById('distance-from-user').textContent = distance.toFixed(2) + " km";

      // Update the visited status based on the distance
      if (distance < distanceThreshold) {

        isVisited = true;
        console.log("isVisited: ", isVisited);
        button.disabled = !isVisited;
      } else {

        isVisited = false;
        console.log("Not Visited: ", isVisited);
        button.disabled = !isVisited;
      }


      // Remove previous marker if exists
      if (currentMarker) {
        map.removeLayer(currentMarker);
      }

      // Add marker for the selected park
      currentMarker = L.marker([parkLat, parkLng]).addTo(map);
      map.setView([parkLat, parkLng], 10); // Set map view to the selected park


    } else {
      console.error("Selected park not found:", selectedParkName);
      alert("Selected park not found. Please try again.");
    }
  }).catch(error => {
    console.error("Failed to fetch park details:", error);
    alert("Could not fetch details for the selected park. Please try again.");
  });
}


button.addEventListener('click', async () => {
  const selectedParkName = document.getElementById('parks-select').value;
  const parks = JSON.parse(localStorage.getItem('parks'));
  const park = parks.filter(park => park.fullName === selectedParkName)[0];
  console.log("parkIDIEIIEIE111 ", park.id);

   // Fetch the current logged-in user
   const currentUser = await api.getCurrentUser();
   console.log("currentUser ", currentUser.id);
   console.log("currentUser2 ", currentUser);
  // const userId = getUserId();
  // console.log("userId ", userId);
  // Call the API endpoint to mark the park as visited
  api.getConfirmVisit(park, currentUser.id)
    .then(response => {
      console.log('Park visited successfully:', response.data);
      isVisited = true; // Update the visited status
      button.disabled = true; // Disable the button after the park is visited
    })
    .catch(error => {
      console.error('Error marking park as visited:', error);
      alert('Error marking park as visited. Please try again.');
    });
});


// Function to calculate distance between two points using Haversine formula
// Wikipedia https://en.wikipedia.org/wiki/Haversine_formula
// Calculator: https://www.omnicalculator.com/other/latitude-longitude-distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

// Function to convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}




//map
var map = L.map('map').setView([51.505, -0.09], 8);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

navigator.geolocation.watchPosition(success, error);
let marker, circle, zoomed;


var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


function success(pos) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  const accuracy = pos.coords.accuracy;

  console.log("here: ", lat, lng, accuracy);
  // Update latitude and longitude of the user location
  document.getElementById('user-lat').textContent = lat;
  document.getElementById('user-lng').textContent = lng;



  if (marker) {
    map.removeLayer(marker);
    map.removeLayer(circle);
  }

  marker = L.marker([lat, lng], { icon: greenIcon }).addTo(map);
  circle = L.circle([lat, lng], { radius: accuracy }).addTo(map);


  //if the map is not zoomed, the zoom remains the same as the user set it
  if (!zoomed) {
    zoomed = map.fitBounds(circle.getBounds());

  }

  //follow the marker when location is changed
  map.setView([lat, lng]);

}


function error(err) {
  if (err.code == 1) {
    alert("Error: Access is denied!");
  } else {
    alert("Error: " + err.message);
  }
}