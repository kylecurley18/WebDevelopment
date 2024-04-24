let uname;
let av;
let currId;
let first;
let last;
let userId;
let username;
let avatar;
let firstName;
let lastName;
let isFollowed = false;

function toggleFollow() {
    const followButton = document.getElementById('followButton');
    if (isFollowed) {
        followButton.textContent = 'Follow';
    } else {
        followButton.textContent = 'Unfollow';
    }
    isFollowed = !isFollowed;
}

document.addEventListener("DOMContentLoaded", function() {
    // Extract user information from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    userId = urlParams.get('userId');
    username = urlParams.get('username');
    avatar = urlParams.get('avatar');
    firstName = urlParams.get('firstName');
    lastName = urlParams.get('lastName');
    console.log(userId);

    // Populate the profile page with user information
    document.getElementById('username').textContent = `@${username}`;
    document.getElementById('avatar').src = avatar;
    document.getElementById('fullName').textContent = `${firstName} ${lastName}`;
    // Additional logic to populate other parts of the profile page
    fetchCurrentUserAndHowls()
    .then(() => {
        Promise.all([
            fetchFollowedUsers(),
        ]).catch(error => console.error('Error fetching data:', error));
    })
    .catch(error => console.error('Error fetching data:', error));
});


function fetchCurrentUserAndHowls() {
    return new Promise((resolve, reject) => {
        fetch('/api/current-user')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch current user');
                }
            })
            .then(currentUser => {
                uname = currentUser.username;
                av = currentUser.avatar;
                first = currentUser.first_name;
                last = currentUser.last_name;

                // Populate the current user information in the header
                const currentUserDiv = document.getElementById('currentUser');
                currentUserDiv.innerHTML = `
                    <span class="username" style="margin-right: 2vw; margin-bottom: 1vw;">@${currentUser.username}</span>
                    <img class="user-avatar" src="${currentUser.avatar}" alt="User Avatar" style="width: 5vw; height: auto; background-color: aliceblue; margin-top: 1vw;">
                `;
                return fetch(`/api/users/${userId}/howls`);
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch user howls');
                }
            })
            .then(userHowls => {
                // Display the user's howls
                displayUserHowls(userHowls, username, avatar, firstName, lastName);
                resolve(); // Resolve the promise once all data is fetched and displayed
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                reject(error); // Reject the promise if any error occurs
            });
    });
}

function fetchFollowedUsers() {
    // Fetch users followed by the user
    fetch(`/api/users/${userId}/following`)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch followed users');
        }
    })
    .then(followedUserIds => {
        // Fetch user information for each followed user
        Promise.all(followedUserIds.map(userId => fetch(`/api/users/${userId}`)))
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(followedUsers => {
            // Display the followed users
            displayFollowedUsers(followedUsers);
        })
        .catch(error => console.error('Error fetching followed users:', error));
    })
    .catch(error => console.error('Error fetching followed users:', error));
}


function displayUserHowls(userHowls, username, avatar, firstName, lastName) {
    userHowls.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    const howlsContainer = document.querySelector('.howls');
    howlsContainer.innerHTML = ''; // Clear previous content

    userHowls.forEach(howl => {
        const howlElement = document.createElement('div');
        howlElement.classList.add('howl');

        const userInfoContainer = document.createElement('div');
        userInfoContainer.classList.add('user-info');

        // Add avatar
        const avatarImg = document.createElement('img');
        avatarImg.src = avatar;
        avatarImg.alt = 'User Avatar';
        avatarImg.classList.add('avatar');
        userInfoContainer.appendChild(avatarImg);

        // Add full name
        const fullName = document.createElement('p');
        fullName.classList.add('full-name');
        fullName.textContent = `${firstName} ${lastName}`;
        userInfoContainer.appendChild(fullName);

        // Add username
        const usernameElement = document.createElement('p');
        usernameElement.classList.add('user-name');
        usernameElement.textContent = `@${username}`;
        userInfoContainer.appendChild(usernameElement);

        // Add timestamp
        const timestamp = document.createElement('p');
        timestamp.classList.add('timestamp');
        timestamp.textContent = new Date(howl.datetime).toLocaleString();

        // Add howl content
        const howlContent = document.createElement('p');
        howlContent.classList.add('howl-content');
        howlContent.textContent = howl.text;

        // Append elements to the howl element
        howlElement.appendChild(userInfoContainer);
        howlElement.appendChild(timestamp);
        howlElement.appendChild(howlContent);

        // Append the howl element to the howls container
        howlsContainer.appendChild(howlElement);
    });
}



function displayFollowedUsers(followedUsers) {
    const followedProfilesContainer = document.querySelector('.followed-profiles');
    followedProfilesContainer.innerHTML = ''; // Clear previous content

    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');

    const dropdownToggle = document.createElement('button');
    dropdownToggle.classList.add('btn', 'btn-secondary', 'dropdown-toggle');
    dropdownToggle.setAttribute('type', 'button');
    dropdownToggle.setAttribute('id', 'dropdownMenuButton');
    dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
    dropdownToggle.setAttribute('aria-expanded', 'false');
    dropdownToggle.textContent = 'Followed Users';
    dropdown.appendChild(dropdownToggle);

    const dropdownMenu = document.createElement('ul');
    dropdownMenu.classList.add('dropdown-menu');
    dropdownMenu.setAttribute('aria-labelledby', 'dropdownMenuButton');

    followedUsers.forEach(user => {
        const userElement = document.createElement('li');
        userElement.classList.add('dropdown-item');

        // Add avatar
        const avatarImg = document.createElement('img');
        avatarImg.src = user.avatar;
        avatarImg.alt = 'User Avatar';
        avatarImg.classList.add('avatar');
        userElement.appendChild(avatarImg);

        // Add full name
        const fullName = document.createElement('span');
        fullName.textContent = `${user.first_name} ${user.last_name}`;
        userElement.appendChild(fullName);

        // Add username link
        const usernameLink = document.createElement('a');
        usernameLink.href = `/profile?userId=${user.id}&username=${user.username}&avatar=${user.avatar}&firstName=${user.first_name}&lastName=${user.last_name}`;
        usernameLink.textContent = `@${user.username}`;
        userElement.appendChild(usernameLink);

        dropdownMenu.appendChild(userElement);
    });

    dropdown.appendChild(dropdownMenu);
    followedProfilesContainer.appendChild(dropdown);
}

function fetchCurrentUserFollows() {
    fetch(`/api/${currId}/following`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch current user follows');
            }
        })
        .then(followedUsers => {
            // Check if the profile user is in the list of followed users
            const isFollowed = followedUsers.includes(userId);
            // Display follow or unfollow button based on the follow status
            displayFollowButton(isFollowed);
        })
        .catch(error => console.error('Error fetching current user follows:', error));
}

// Function to display follow or unfollow button
function displayFollowButton(isFollowed) {
    const followButton = document.getElementById('followButton');
    if (isFollowed) {
        followButton.textContent = 'Unfollow';
        followButton.addEventListener('click', unfollowUser);
    } else {
        followButton.textContent = 'Follow';
        followButton.addEventListener('click', followUser);
    }
}

// Function to follow a user
function followUser() {
    fetch(`/api/users/${userId}/follow`, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                // Update button text and behavior
                displayFollowButton(true);
            } else {
                throw new Error('Failed to follow user');
            }
        })
        .catch(error => console.error('Error following user:', error));
}

// Function to unfollow a user
function unfollowUser() {
    fetch(`/api/users/${userId}/unfollow`, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                // Update button text and behavior
                displayFollowButton(false);
            } else {
                throw new Error('Failed to unfollow user');
            }
        })
        .catch(error => console.error('Error unfollowing user:', error));
}

