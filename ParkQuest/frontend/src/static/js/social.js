import api from './APIClient.js';

function fillPosts(current, posts, users) {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = ''; // Clear previous content
    posts.forEach(post => {
        const user = users.find((user) => user.id == post.userId);

        const postElement = document.createElement('div');
        postElement.classList.add('card', 'mb-3');

        const elementBody = document.createElement('div');
        elementBody.classList.add('card-body');

        // Title
        const postTitle = document.createElement('div');
        postTitle.classList.add('card-title');
        postTitle.classList.add('postTitle');

        const titleProfile = document.createElement('div');
        titleProfile.classList.add('profile');

        // const img = document.createElement('img');
        // img.src = user.avatar;
        // titleProfile.appendChild(img);

        const name = document.createElement('h3');
        name.innerHTML = user.first_name + " " + user.last_name;
        titleProfile.appendChild(name);

        const profile = document.createElement('a');
        profile.href = './profile?userId=' + user.id;
        const usrName = document.createElement('h5');
        usrName.innerHTML = '@' + user.username;
        profile.appendChild(usrName);
        titleProfile.appendChild(profile);


        postTitle.appendChild(titleProfile);

        const titleTime = document.createElement('div');
        titleTime.classList.add('postDate');

        const postDate = document.createElement('p');
        const date = new Date(post.datetime);
        const formattedDate = date.toLocaleString('en-US', { timeZoneName: 'short' });
        postDate.innerHTML = formattedDate;
        titleTime.appendChild(postDate);

        postTitle.appendChild(titleTime);

        elementBody.appendChild(postTitle);

        //Text
        const postText = document.createElement('p');
        postText.classList.add('card-text');
        postText.innerHTML = post.text;

        elementBody.appendChild(postText);

        //Delete button
        if (user.id == current.id) {
            const deleteContainer = document.createElement('div');

            const deleteBtn = document.createElement('input');
            deleteBtn.setAttribute('type', 'button');
            deleteBtn.setAttribute('id', 'deleteBtn');
            deleteBtn.classList.add('btn');

            deleteBtn.setAttribute('value', 'Delete');
            deleteBtn.classList.add('btn-danger');

            deleteBtn.addEventListener('click', (e) => {
                api.deletePost(post).then((postData) => {
                    console.log(postData);
                    location.reload();
                }).catch((err) => {
                    console.error('Error deleting post:', err);
                });
            });

            deleteContainer.appendChild(deleteBtn);
            elementBody.appendChild(deleteContainer);
        }

        postElement.appendChild(elementBody);

        postsContainer.appendChild(postElement);
    });
}

// Function to fetch and display howls
function displayPosts(current) {
    api.getPosts().then((posts) => {
        posts.sort((a, b) => {
            let aDate = new Date(a.datetime);
            let bDate = new Date(b.datetime);

            return bDate - aDate;
        })

        api.getUsers().then((users) => {
            fillPosts(current, posts, users);
        }).catch((err) => {
            if (err.status === 401) {
                console.log("We are not logged in");
                document.location = './';
            }
            else {
                console.error('Error fetching users:', err);
            }
        });
    }).catch((err) => {
        if (err.status === 401) {
            console.log("We are not logged in");
            document.location = './';
        }
        else {
            console.error('Error fetching posts:', err);
        }
    });
}

window.addEventListener("DOMContentLoaded", (e) => {
    api.getCurrentUser().then((user) => {

        const errorBox = document.getElementById('error');

        const postInput = document.getElementById('postText');
        postInput.addEventListener("invalid", (e) => {
            postInput.setCustomValidity('Must input a mesage to post');
        });

        postInput.addEventListener("input", (e) => {
            postInput.setCustomValidity('');
            errorBox.textContent = '';
        });

        // Function to handle form submission for posting a new howl
        let form = document.getElementById('postForm');
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const postText = postInput.value;
            api.createPost(user, postText).then((postData) => {
                console.log(postData);
                displayPosts(user);
            }).catch((err) => {
                console.error('Error posting howl:', err);
                errorBox.textContent = err;
            });
        });

        // Fetch and display howls when the page loads
        displayPosts(user);
    }).catch((err) => {
        if (err.status === 401) {
            console.log("We are not logged in");
            document.location = './login';
        }
        else {
            console.error('Error fetching user:', err);
        }
    });
});