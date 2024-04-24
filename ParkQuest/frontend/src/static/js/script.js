const toggler = document.querySelector(".btn");
const sidebar = document.querySelector("#sidebar");
const BASE_PATH = '';


// Start by adding the class "collapse" to the mainNav
sidebar.classList.remove('collapsed');

// Establish a function to toggle the class "collapse"
function sideBarToggle() {
    sidebar.classList.toggle('collapsed');
}

// Add a click event to run the toggler function
toggler.addEventListener('click', sideBarToggle);



// //Opening home page
// document.addEventListener("DOMContentLoaded", function () {
//     const homeLink = document.querySelector(".sidebar-item:first-child .sidebar-link");
//     const mainContent = document.querySelector(".content .container-fluid"); // Target the container where content will be loaded

//     homeLink.addEventListener("click", function (event) {
//         event.preventDefault();
//         loadContent(BASE_PATH + "/home", mainContent);
//     });
// });

// //Opening History page
// document.addEventListener("DOMContentLoaded", function () {
//     const progressLink = document.querySelector(".sidebar-item:nth-child(2) .sidebar-link");
//     const mainContent = document.querySelector(".content .container-fluid"); // Target the container where content will be loaded

//     progressLink.addEventListener("click", function (event) {
//         event.preventDefault();
//         loadContent(BASE_PATH + "/history", mainContent);
//     });
// });

// //Opening Community page
// document.addEventListener("DOMContentLoaded", function () {
//     const progressLink = document.querySelector(".sidebar-item:nth-child(3) .sidebar-link");
//     const mainContent = document.querySelector(".content .container-fluid"); // Target the container where content will be loaded

//     progressLink.addEventListener("click", function (event) {
//         event.preventDefault();
//         loadContent(BASE_PATH + "/community", mainContent);
//     });
// });

// //Opening Add Friends page
// document.addEventListener("click", function () {
//     const button = document.getElementById('add-friends-button');
//     console.log(button);
//     const mainContent = document.querySelector(".content .container-fluid"); // Target the container where content will be loaded

//     if (button != null) {
//         button.addEventListener("click", function (event) {
//             event.preventDefault();
//             loadContent(BASE_PATH + "/addfriends", mainContent);
//         });
//     }
// });

// //Opening Activity page
// document.addEventListener("DOMContentLoaded", function () {
//     const progressLink = document.querySelector(".sidebar-item:nth-child(4) .sidebar-link");
//     const mainContent = document.querySelector(".content .container-fluid"); // Target the container where content will be loaded

//     progressLink.addEventListener("click", function (event) {
//         event.preventDefault();
//         loadContent(BASE_PATH + "/activity", mainContent);
//     });
// });

// //Opening progress page
// document.addEventListener("DOMContentLoaded", function () {
//     const progressLink = document.querySelector(".sidebar-item:nth-child(5) .sidebar-link");
//     const mainContent = document.querySelector(".content .container-fluid"); // Target the container where content will be loaded

//     progressLink.addEventListener("click", function (event) {
//         event.preventDefault();
//         loadContent(BASE_PATH + "/progress", mainContent);
//     });
// });

// //Opening Profile page
// document.addEventListener("DOMContentLoaded", function () {
//     const progressLink = document.querySelector(".sidebar-item:nth-child(6) .sidebar-link");
//     const mainContent = document.querySelector(".content .container-fluid"); // Target the container where content will be loaded

//     progressLink.addEventListener("click", function (event) {
//         event.preventDefault();
//         loadContent(BASE_PATH + "/profile", mainContent);
//     });
// });

// function loadContent(url, container) {
//     fetch(url)
//         .then(response => response.text())
//         .then(data => {
//             container.innerHTML = data;
//         })
//         .catch(error => console.error('Error:', error));
// }

// //Opening camera
