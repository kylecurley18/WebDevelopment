import api from './APIClient.js';

let userIdParam;

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        userIdParam = urlParams.get('userId');

        const user = await api.getUserById(userIdParam);
        
        document.querySelector('.card-body h5').textContent = `${user.first_name} ${user.last_name}`;

        // Fetch the current logged-in user
        const currentUser = await api.getCurrentUser();

        // Check if the user ID parameter matches the ID of the current logged-in user
        const canEdit = currentUser.id == userIdParam;

        // Now you can use the `canEdit` variable to determine whether to display the "Edit" button
        if (canEdit) {
            // Display the "Edit" button
            document.getElementById('editButton').style.display = 'block';
            document.getElementById('messageButton').style.display = 'none';
        } else {
            // Hide the "Edit" button
            document.getElementById('editButton').style.display = 'none';
            document.getElementById('messageButton').style.display = 'block';
        }

        document.getElementById('first').textContent = user.first_name;
        document.getElementById('last').textContent = user.last_name;
        document.getElementById('email').textContent = user.email;
        document.getElementById('username').textContent = user.username;
        document.getElementById('parks').textContent = user.num_parks;
    } catch (err) {
        if (err.status === 401) {
            console.log("We are not logged in");
            document.location = './login';
        } else {
            console.error('Error fetching current user:', err);
        }
    }
});

document.getElementById('editButton').addEventListener('click', () => {
    // Show input fields for editing
    document.getElementById('first').innerHTML = `<input type="text" id="firstNameInput" value="${document.getElementById('first').innerText}">`;
    document.getElementById('last').innerHTML = `<input type="text" id="lastNameInput" value="${document.getElementById('last').innerText}">`;
    document.getElementById('username').innerHTML = `<input type="text" id="usernameInput" value="${document.getElementById('username').innerText}">`;
  
    // Hide edit button and show submit button
    document.getElementById('editButton').style.display = 'none';
    document.getElementById('submitButton').style.display = 'block';
});
  
document.getElementById('submitButton').addEventListener('click', async () => {
    const userId = userIdParam;
    const firstName = document.getElementById('firstNameInput').value;
    const lastName = document.getElementById('lastNameInput').value;
    const username = document.getElementById('usernameInput').value;
    
    try {
        // Make PUT request to update user information
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, username })
        });
    
        if (response.ok) {
            // Update the information displayed on the page
            document.querySelector('.card-body h5').textContent = firstName + " " + lastName;
            document.getElementById('first').innerHTML = firstName;
            document.getElementById('last').innerHTML = lastName;
            document.getElementById('username').innerHTML = username;

            
            // Hide submit button and show edit button
            document.getElementById('submitButton').style.display = 'none';
            document.getElementById('editButton').style.display = 'block';
            // Reload the page or update the UI as needed
        } else {
            const errorMessage = await response.text();
            alert('Error updating user information: ' + errorMessage);
        }
    } catch (error) {
        console.error('Error updating user information:', error);
        alert('Error updating user information. Please try again later.');
    }
});

const initializeFollowButton = async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const userIdParam = urlParams.get('userId');
        const currentUser = await api.getCurrentUser();

        // Check if the current user follows the user of the profile page
        const userFollowing = await api.getUserFollowing(currentUser.id);
        const isFollowing = userFollowing.following.includes(userIdParam);

        // Update message button text based on whether the user is following or not
        if (isFollowing) {
            messageButton.textContent = 'Unfollow';
        } else {
            messageButton.textContent = 'Follow';
        }
    } catch (error) {
        console.error('Error initializing follow button:', error);
    }
};

const toggleFollow = async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const userIdParam = urlParams.get('userId');
        const currentUser = await api.getCurrentUser();
        const user = await api.getUserById(userIdParam);
        console.log(user);

        // Check if the current user follows the user of the profile page
        const userFollowing = await api.getUserFollowing(currentUser.id);
        console.log('User following response:', userFollowing);
        const isFollowing = userFollowing.following.includes(user.username);
        console.log(isFollowing);

        if (isFollowing) {
            // If already following, unfollow the user
            await api.unFollowUser(currentUser.id, userIdParam);
            messageButton.textContent = 'Follow';
            updateFollowCounts;
        } else {
            // If not following, follow the user
            await api.followUser(currentUser.id, userIdParam);
            messageButton.textContent = 'Unfollow';
            updateFollowCounts;
        }
        const updatedFollowing = await api.getUserFollowing(userIdParam);
        const updatedFollowers = await api.getUserFollowers(userIdParam);

        // Update the text content of the counts
        document.getElementById('followsCount').textContent = updatedFollowing.following.length;
        document.getElementById('followersCount').textContent = updatedFollowers.followers.length;
    } catch (error) {
        console.error('Error toggling follow/unfollow:', error);
    }
};

window.addEventListener("DOMContentLoaded", initializeFollowButton);


messageButton.addEventListener('click', toggleFollow);

const updateFollowCounts = async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const userIdParam = urlParams.get('userId');

        // Fetch the count of users followed by the profile user
        const userFollowingResponse = await api.getUserFollowing(userIdParam);
        const followsCount = userFollowingResponse.following.length;
        document.getElementById('followsCount').textContent = followsCount;

        // Fetch the count of followers of the profile user
        const userFollowersResponse = await api.getUserFollowers(userIdParam);
        const followersCount = userFollowersResponse.followers.length;
        document.getElementById('followersCount').textContent = followersCount;
    } catch (error) {
        console.error('Error updating follow counts:', error);
    }
};

// Call the function to update follow counts when the page loads
window.addEventListener("DOMContentLoaded", updateFollowCounts);
