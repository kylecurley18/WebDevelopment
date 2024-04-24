import api from './APIClient.js';

function fillUsers(container, users, pos) {
    const user = users[pos];

    const userElement = document.createElement('div');
    userElement.classList.add('card', 'mb-3');

    const elementBody = document.createElement('div');
    elementBody.classList.add('card-body');
    elementBody.classList.add('userCard');

    // Title
    const rankTitle = document.createElement('div');
    rankTitle.classList.add('card-title');
    rankTitle.classList.add('rankTitle');

    const rank = document.createElement('h3');

    rank.innerHTML = pos + 1;
    rank.innerHTML += '.';
    rankTitle.appendChild(rank);

    elementBody.appendChild(rankTitle);

    const userTitle = document.createElement('div');
    userTitle.classList.add('card-subtitle');
    userTitle.classList.add('userTitle');

    const titleProfile = document.createElement('div');
    titleProfile.classList.add('profile');

    const name = document.createElement('h3');
    name.innerHTML = user.first_name + " " + user.last_name;
    titleProfile.appendChild(name);

    const profile = document.createElement('a');

    profile.href = './profile?userId=' + user.id;
    const usrName = document.createElement('h5');
    usrName.innerHTML = '@' + user.username;
    profile.appendChild(usrName);
    titleProfile.appendChild(profile);

    userTitle.appendChild(titleProfile);

    elementBody.appendChild(userTitle);

    const userParks = document.createElement('div');
    userParks.classList.add('card-text');
    userParks.classList.add('userParks');

    const parksVisited = document.createElement('p');
    parksVisited.innerHTML = "Parks Visited: " + user.num_parks;
    userParks.appendChild(parksVisited);

    elementBody.appendChild(userParks);

    userElement.appendChild(elementBody);

    container.appendChild(userElement);
}

// Function to fetch and display users
function displayOthers(users) {

    const othersContainer = document.getElementById('others');
    othersContainer.innerHTML = ''; // Clear previous content

    for (let i = 3; i < users.length; i++) {

        if (users[i]) {
            fillUsers(othersContainer, users, i);
        }
    }
}

// Function to fetch and display users
function displayTop3(users) {

    const topContainer = document.getElementById('topUsers');
    topContainer.innerHTML = ''; // Clear previous content

    const firstContainer = document.createElement('div');
    firstContainer.setAttribute('id', 'first');

    fillUsers(firstContainer, users, 0);

    topContainer.appendChild(firstContainer);

    const runnerUpsContainer = document.createElement('div');
    runnerUpsContainer.setAttribute('id', 'runnerUps');

    for (let i = 1; i < 3; i++) {

        if (users[i]) {
            fillUsers(runnerUpsContainer, users, i);
        }
        else {
            break;
        }
    }

    topContainer.appendChild(runnerUpsContainer);
}

//Opening Add Friends page
document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById('add-friends-button');

    button.addEventListener("click", function (event) {
        window.location.href = "./addfriends";
    });

    api.getCurrentUser().then((current) => {

        api.getUsers().then((users) => {
            users.sort((a, b) => {
                if (a.num_parks < b.num_parks) {
                    return -1;
                }
                else {
                    return 1;
                }
            });

            displayTop3(users);
            displayOthers(users);
        }).catch((err) => {
            console.error('Error fetching users:', err);
        });
    }).catch((err) => {
        if (err.status === 401) {
            console.log("We are not logged in");
            document.location = './login';
        }
        else {
            console.error('Error fetching users:', err);
        }
    });
});