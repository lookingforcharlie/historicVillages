// See the official Google Map documentation here:
//   https://developers.google.com/maps/documentation/javascript/overview

// The initMap() function will be called when the above Google Maps JS
// library finishes loading.  Notice the URL parameter callback=initMap,
// this is how the library knows to call this initMap function when it
// is done loading.  We could change the name of the function in that
// URL if we wanted to call it something different.
let google_map;
let new_marker;
let markers = [];

// array of start_markers stores the locations that users input
let start_marker;
let start_markers = [];

function initMap() {
  // This will create a new Google Map object, and the variable map will
  // contain a reference to the object.  The first argument is the element
  // to place the map into, and the 2nd argument is a JSON with keys and
  // objects describing how to make the map.  At a minimum we need to
  // provide center and zoom values as part of this object.

  // Create a google map centered at city of Oakville
  google_map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 43.4675, lng: -79.6877 },
    zoom: 12,
  });

  // only create one info window to move it around here
  const infoWindow = new google.maps.InfoWindow({ shouldFocus: false });

  // use regular function here, can't use 'this' keyword by arrow function
  function marker_clicked() {
    infoWindow.close(); // Close previously opened infoWindow first
    console.log(this);
    infoWindow.setContent(
      `<strong>Name</strong>: ${this.name} <br/>
            <strong>Label</strong>: ${this.label} <br/>
            <strong>Category</strong>: ${this.category} <br/> <br/>
            <img src="https://www.oakville.ca/images/logo-oakville-black.png" width="100"/>
          `
    );

    infoWindow.open(google_map, this);
  }
  // put markers on the map for all historic villages in historicVillages.js
  for (i = 0; i < historicVillages.length; i++) {
    // set the icon based on the category of the school
    if (historicVillages[i].CATEGORY == 'Corner')
      new_icon = 'http://maps.google.com/mapfiles/kml/paddle/grn-blank.png';
    else if (historicVillages[i].CATEGORY == 'Village')
      new_icon = 'http://maps.google.com/mapfiles/kml/paddle/pink-blank.png';
    else if (historicVillages[i].CATEGORY == 'Town')
      new_icon = 'http://maps.google.com/mapfiles/kml/paddle/ylw-blank.png';
    else new_icon = 'http://maps.google.com/mapfiles/kml/paddle/blu-blank.png';

    // retrieve data from historicVillages.js to create markers
    new_marker = new google.maps.Marker({
      position: {
        lat: historicVillages[i].LATITUDE,
        lng: historicVillages[i].LONGITUDE,
      },
      title: historicVillages[i].NAME,
      icon: new_icon,
    });

    // put the marker onto the map (it will not appear otherwise)
    new_marker.setMap(google_map);

    // store the name, label, category, lat and lng as a property of the marker object
    new_marker.name = historicVillages[i].NAME;
    new_marker.label = historicVillages[i].LABEL;
    new_marker.category = historicVillages[i].CATEGORY;
    new_marker.lat = historicVillages[i].LATITUDE;
    new_marker.lng = historicVillages[i].LONGITUDE;

    // have the info window open when the marker is clicked...
    new_marker.addListener('click', marker_clicked);

    markers.push(new_marker);

    // make a drop down list for Historic Village by retrieving the name of new_markers
    const desList = document.querySelector('#destination');
    let options = '';
    for (let i = 0; i < markers.length; i++) {
      options += `<option value="${markers[i].name}">${markers[i].name}</option>`;
    }
    desList.innerHTML = options;
  }
}

// filter the initial markers by category of 'Corner'
function filterCorner() {
  for (i = 0; i < markers.length; i++) {
    if (markers[i].category == 'Corner') markers[i].setMap(google_map);
    else markers[i].setMap(null);
  }
}

document.getElementById('corner').addEventListener('click', filterCorner);

// filter the initial markers by category of 'Hollow'
function filterHollow() {
  for (i = 0; i < markers.length; i++) {
    if (markers[i].category == 'Hollow') markers[i].setMap(google_map);
    else markers[i].setMap(null);
  }
}

document.getElementById('hollow').onclick = filterHollow;

// filter the initial markers by category of 'Village'
function filterVillage() {
  for (i = 0; i < markers.length; i++) {
    if (markers[i].category == 'Village') markers[i].setMap(google_map);
    else markers[i].setMap(null);
  }
}

document.getElementById('village').onclick = filterVillage;

// filter the initial markers by category of 'Town'
function filterTown() {
  for (i = 0; i < markers.length; i++) {
    if (markers[i].category == 'Town') markers[i].setMap(google_map);
    else markers[i].setMap(null);
  }
}

document.getElementById('town').onclick = filterTown;

// show all the initial markers
function showAll() {
  for (i = 0; i < markers.length; i++) markers[i].setMap(google_map);
}

document.getElementById('all').onclick = showAll;

// @ show current location on the map
function showPositionOnMap(position) {
  // create a marker centered at the user's location
  currentMarker = new google.maps.Marker({
    position: {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    },
    title: 'Your Location', // will appear when we hover over the marker
    // We use a custom marker: https://developers.google.com/maps/documentation/javascript/custom-markers
    // A list of icons we can use is found here: http://kml4earth.appspot.com/icons.html
    icon: 'http://maps.google.com/mapfiles/kml/shapes/ranger_station.png',
  });

  // put the marker onto the map (it will not appear otherwise)
  currentMarker.setMap(google_map);
  // make the map center the current location
  google_map.setCenter(currentMarker.getPosition());

  currentMarker.name = 'Your current location';
  currentMarker.lat = position.coords.latitude;
  currentMarker.lng = position.coords.longitude;
}

// call showPositionOnMap after finding the user's current location
document.querySelector('#currentLocation').addEventListener('click', () => {
  console.log('Current Loc');
  navigator.geolocation.getCurrentPosition(showPositionOnMap);
});

// @ Show Start Point on the map
// Url example with real address to see the data returned
// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyCbsua4EskTMpwMIvO5vkvTgw35rhCwTfs

const geoCode = async (e) => {
  e.preventDefault();
  const loc = document.querySelector('#addressInput').value;
  // const key = 'AIzaSyCbsua4EskTMpwMIvO5vkvTgw35rhCwTfs';
  const key = 'AIzaSyATmbWyc-LDt9jecM-XAL0-_m3dvwv5vQo';

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${key}`
    );
    const data = await res.json();

    const latOfAddress = data.results[0].geometry.location.lat;
    const lngOfAddress = data.results[0].geometry.location.lng;

    const locIcon = {
      url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      scaledSize: new google.maps.Size(40, 40), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0), // anchor
    };

    start_marker = new google.maps.Marker({
      position: {
        lat: latOfAddress,
        lng: lngOfAddress,
      },
      title: data.results[0].formatted_address,
      icon: locIcon,
    });

    // put the marker onto the map (it will not appear otherwise)
    start_marker.setMap(google_map);

    contentString = 'Input of Location';
    const infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });

    infoWindow.open({
      anchor: start_marker,
      shouldFocus: false,
    });

    // store name, lat and lng as properties of start_marker
    // will use this make drop down list for start points
    start_marker.name = data.results[0].formatted_address;
    start_marker.lat = latOfAddress;
    start_marker.lng = lngOfAddress;

    // push start_marker into start_markers array
    // will loop through start_markers array to make drop down list
    start_markers.push(start_marker);

    // making a drop down list for start points
    const startList = document.querySelector('#start');
    let options = '';
    for (let i = 0; i < start_markers.length; i++) {
      options += `<option value='${start_markers[i].name}'>${start_markers[i].name}</option>`;
    }
    startList.innerHTML = options;
  } catch (err) {
    console.error(err);
  }
};

// Get location form
const locationForm = document.querySelector('#locForm');
// listen for a submission
locationForm.addEventListener('submit', geoCode);

// @ Find direction to historic village
// all villages' lat and lng are stored in array of "markers": let markers = [];
// all start points' formal addresses are stored in array of "start_markers", let start_markers =[];

// make these two globe in order to remove the previous direction on the map
let directionsService;
let directionsRenderer;
const showDirection = (e) => {
  e.preventDefault();
  // remove the previous direction once render a new direction on the map
  if (directionsRenderer) {
    directionsRenderer.setMap(null);
  }

  const startValue = document.querySelector('#start').value;
  const desValue = document.querySelector('#destination').value;
  console.log('-------');
  console.log('desValue: ', desValue);
  console.log(markers[1].lat, markers[1].lng);
  console.log('-------');

  const commuteValue = document.querySelector('#commute').value;

  const desMarker = markers.find((marker) => marker.name === desValue);

  // destructuring desMarker to get lat and lng in order to put inside "request"
  const { lat: desLat, lng: desLng } = desMarker;
  console.log('-------');
  console.log('desMarker: ', desMarker);
  console.log(desLat, desLng);
  console.log('-------');

  // services used to provide directions
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  // have the directions renderer work with this map
  directionsRenderer.setMap(google_map);

  // setup a basic directions request with origin, destination, travel mode retrieved from drop down list
  // there are MANY more possible options here
  request = {
    origin: startValue,
    destination: `${desLat},${desLng}`,
    travelMode: commuteValue,
  };
  // use the directions service and directions renderer to render the
  // directions on the map
  directionsService.route(request, function (result, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(result);
      console.log(result);
    }
  });
};

const directionForm = document.querySelector('#directionForm');
directionForm.addEventListener('submit', showDirection);
