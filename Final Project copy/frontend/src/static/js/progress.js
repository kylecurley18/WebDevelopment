import api from './APIClient.js';

window.addEventListener("DOMContentLoaded", async (e) => {
    try {
        // Fetch the current user's data
        const currentUser = await api.getCurrentUser();
        
        // Get the current user's ID
        const userId = currentUser.id;

        // Call the API to get the list of visited parks
        const visitedParks = await api.getVisitedParks(userId);
        console.log(visitedParks); // Log the visited parks to the console or do further processing

        const numberOfVisitedParks = visitedParks.length;
        if (numberOfVisitedParks == 0) {
            document.getElementById('lastVisitedParkName').textContent = "None";
        } else {
            const lastVisitedPark = visitedParks[visitedParks.length - 1];
            console.log(lastVisitedPark);
            const lastVisitedParkId = lastVisitedPark.park_id;
            const lastVisitedParkDetails = await api.getParkDetailsById(lastVisitedParkId);

            // Get the name of the last visited park
            const lastVisitedParkName = lastVisitedParkDetails.name;
            document.getElementById('lastVisitedParkName').textContent = lastVisitedParkName;
        }
        if (numberOfVisitedParks > 0) {
            const noviceText = document.querySelector('.novice-text');

            // Change the color to green
            noviceText.style.color = 'green';

        }
        if (numberOfVisitedParks > 4) {
            const semiProText = document.querySelector('.semipro-text');

            // Change the color to green
            semiProText.style.color = 'green';

        }
        if (numberOfVisitedParks > 9) {
            const proText = document.querySelector('.pro-text');

            // Change the color to green
            proText.style.color = 'green';

        }
        if (numberOfVisitedParks > 49) {
            const allstarText = document.querySelector('.allstar-text');

            // Change the color to green
            allstarText.style.color = 'green';

        }
        if (numberOfVisitedParks > 99) {
            const legendText = document.querySelector('.legend-text');

            // Change the color to green
            legendText.style.color = 'green';

        }

        // Update the HTML element with the name of the last visited park
        document.getElementById('totalParksVisited').textContent = numberOfVisitedParks;
        document.getElementById('parksVisitedThisMonth').textContent = numberOfVisitedParks;

        const allVisitedParksSelect = document.getElementById('allVisitedParks');

        // Clear any existing options
        allVisitedParksSelect.innerHTML = '';

        // Create and append an option element for each visited park
        console.log(visitedParks);
        visitedParks.forEach(async park => {
            const option = document.createElement('option');
            const parkDets = await api.getParkDetailsById(park.park_id);
            console.log(parkDets);
            option.textContent = parkDets.name;
            option.value = park.park_id; // Assuming each park object has an 'id' property
            allVisitedParksSelect.appendChild(option);
        });        

    } catch (err) {
        if (err.status === 401) {
            console.log("We are not logged in");
            document.location = './login';
        } else {
            console.error('Error fetching user progress:', err);
        }
    }
});