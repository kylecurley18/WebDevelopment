import api from './APIClient.js';

window.addEventListener("DOMContentLoaded", (e) => {
  // Fetch the current user's ID using your API client
  api.getCurrentUser().then((currentUser) => {
    console.log(currentUser);
    const userId = currentUser.id;
    const profileUrl = `/profile?userId=${userId}`;

    // Get the Profile link element by ID
    const profileLink = document.getElementById("profile-link");

    // Set the href attribute of the Profile link to the dynamically generated URL
    profileLink.href = profileUrl;
  }).catch((err) => {
    if (err.status === 401) {
      console.log("We are not logged in");
      document.location = './login';
    } else {
      console.error('Error fetching current user:', err);
    }
  });

  const navBar = document.getElementById('navContainer');

  const logoutContainer = document.createElement('div');

  const logoutBtn = document.createElement('input')
  logoutBtn.setAttribute('type', 'button');
  logoutBtn.classList.add('btn');
  logoutBtn.classList.add('btn-primary');
  logoutBtn.setAttribute('value', 'Logout');

  logoutBtn.style.padding = '10px 20px'; // Adjust padding as needed
  logoutBtn.style.borderRadius = '10px'; // Add border radius
  logoutBtn.style.backgroundColor = '#00490f'; // Set background color
  logoutBtn.style.color = '#fff'; // Set text color
  logoutBtn.style.border = 'none';

  logoutBtn.addEventListener('click', (e) => {
    api.logOut().then((logoutData) => {
      console.log(logoutData);
      window.location.href = './login';
    }).catch((err) => {
      console.error('Error logging out user:', err);
    });
  });

  logoutContainer.appendChild(logoutBtn);

  navBar.appendChild(logoutContainer);
});

    /*********************\
* SERVICE WORKER CODE *
\*********************/

function registerServiceWorker() {
  console.log('Service worker *****************');
  if (!navigator.serviceWorker) { // Are SWs supported?
    return;
  }

  navigator.serviceWorker.register('/serviceWorker.js')
    .then(registration => {
      /*if (!navigator.serviceWorker.controller) {
        //Our page is not yet controlled by anything. It's our first SW
        return;
      }*/

      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed, but waiting');
        newServiceWorkerReady(registration.waiting);
      } else if (registration.active) {
        console.log('Service worker active');
      }

      registration.addEventListener('updatefound', () => { //This is fired whenever registration.installing gets a new worker
        
        console.log("SW update found", registration, navigator.serviceWorker.controller);
        newServiceWorkerReady(registration.installing);
      });
    })
    .catch(error => {
      console.error(`Registration failed with error: ${error}`);
    });

  navigator.serviceWorker.addEventListener('message', event => {
    console.log('SW message', event.data);
  });

  // Ensure refresh is only called once.
  // This works around a bug in "force update on reload" in dev tools.
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if(refreshing) return;
    window.location.reload();
    refreshing = true;
  });

};

registerServiceWorker();

// document.addEventListener('DOMContentLoaded', (e) => {
  
//   registerServiceWorker();
//   console.log('Service worker registered DOM');

// });

//This method is used to notify the user of a new version
function newServiceWorkerReady(worker) {
  const popup =  document.createElement('div');
  popup.className = "popup";
  popup.innerHTML = '<div>New Version Available</div>';

  const buttonOk = document.createElement('button');
  buttonOk.innerHTML = 'Update';
  buttonOk.addEventListener('click', e => {
    worker.postMessage({action: 'skipWaiting'});
  });
  popup.appendChild(buttonOk);

  const buttonCancel = document.createElement('button');
  buttonCancel.innerHTML = 'Dismiss';
  buttonCancel.addEventListener('click', e => {
    document.body.removeChild(popup);
  });
  popup.appendChild(buttonCancel);

  document.body.appendChild(popup);
}