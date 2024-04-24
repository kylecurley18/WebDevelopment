import api from './APIClient.js';

// Step 1. Set constant for the selected county key
const SELECTED_COUNTY_KEY = 'selectedCounty';

const countiesSelect = document.querySelector('#counties-select');
countiesSelect.addEventListener('change', e => {
  // Step 2. Save the selected county to local storage
  localStorage.setItem(SELECTED_COUNTY_KEY, e.target.value);
  updateParks()
});


// Step 3. Get the selected county from local storage
const storageCounty = localStorage.getItem(SELECTED_COUNTY_KEY);

api.getCounties().then(counties => {
  counties.forEach(county => {
    const option = document.createElement('option');
    option.innerHTML = county.name;
    option.value = county.id;
    // Step 4. Set the selected county in the select element
    if(county.id == storageCounty) {
      option.selected = true;
    }
    countiesSelect.append(option);
  });
  updateParks();
});


function updateParks() {
  const cIndex = countiesSelect.selectedIndex;
  const countyId = countiesSelect[cIndex].value;
  api.getParksByCountyId(countyId).then(parks => {
    resetParks();
    fillParksHTML(parks);
  });
}

/**
 * Clear current parks
 */
function resetParks(parks) {
  const parkList = document.getElementById('parks-list');
  parkList.innerHTML = '';
}

/**
 * Create all parks HTML and add them to the webpage.
 */
function fillParksHTML(parks) {
  const parkList = document.getElementById('parks-list');
  parks.forEach(park => {
    parkList.append(createParkHTML(park));
  });

}

/**
 * Create park HTML.
 */
function createParkHTML(park) {
  const item = document.createElement('a');
  item.classList.add('park');
  item.href = '/park?id=' + park.id;

  const name = document.createElement('h2');
  name.innerHTML = park.name;
  item.appendChild(name);

  const img = document.createElement('img');
  img.src = "/img/park.jpg";
  item.appendChild(img);

  const countyLabel = document.createElement('div');
  countyLabel.innerHTML = 'Spans Counties:';
  countyLabel.classList.add('counties-list');
  item.appendChild(countyLabel);

  park.counties.forEach(county => {
    const countyTag = document.createElement('span');
    countyTag.classList.add('county');
    countyTag.innerHTML = county.name;
    item.appendChild(countyTag);
  });

  return item;
}