# [ParkQuest]
## Group [P]: Final Project


### What is Done:
Our project now uses service workers to provide offline functionality, by adding our css, images, and frontend javascript files to the cache. Our service workers also intercepts all api calls.  
We have fixed our parks API key placement by moving it to the env file. Our project also now validates user information when they register in the backend.
We have added a logout button and added the ability to add and delete user posts on our social page.
Minor styling changes were made and our project now uses a favicon and is PWA installable. 

### What is Not Done:
There is no more work to be done at this time.

### Authentication:
Our application implements authorization using JWT tokens using the jsonwebtoken package. These tokens are saved in a cookie called ParkQuest. The token
contains general information on the current user logged in excluding the user's salt and hashed password. API endpoints also use middleware called TokenMiddleware
that checks whether the user is logged in. If they are not, they will not be able to access any of the web pages and api endpoints until they are logged in.
If a user is not logged in on a webpage, they will be redirected to the login page.

### Pages
| HTML PAGES           | Navigation | Offline Functionality                                                                  |
|----------------------|-------------|-------------------------------------------------------------------------|
| Login/Signup         | App redirects to login automatically. Register can be accesed through a link in the login page        | - Page content and css loads, but need to already be signed in to actually sign in         |
| Progress / Milestone | Accesed through the Progress tab in the side bar or by adding /progress to the url         | - dynamic content and css loads                    |
| Home Page            | Accesed through the Home tab in the side bar or by adding /home to the url. App also directs to this page after login         | - dynamic content and css loads, can't track park           |
| Profile              | Accesed through the Profile tab in the side bar or by adding /profile to the url         | - dynamic content and css loads, can't edit or add friend                                               |
| Add Friends          | Accesed through the Community page from the add friends button or by adding /addfriends to the url         | - dynamic content and css loads, cant add friends                                                        |
| Community            | Accesed through the Community tab in the side bar or by adding /community to the url         | - dynamic content and css loads                               |
| Social               | Accesed through the Social tab in the side bar or by adding /social to the url| - Posts load, but can't make new or delete post
### Caching Strategy
We decided to use the network first approach to get the latest updates of the app before going to the cache. We add our css, images, and frontend javascript to the cache.
### Web Page Progress

| HTML PAGES           | % completed | TO DO                                                                   |
|----------------------|-------------|-------------------------------------------------------------------------|
| Template Page        | 100%         | - Completed                                       |
| Login/Signup         | 100%        | - Completely implemented with token authentication and hashing          |
| Progress / Milestone | 100%         | - Completed                    |
| Home Page            | 100%         | - Completed           |
| Profile              | 100%         | - Completed                                               |
| Add Friends          | 100%         | - Completed                                                        |
| Community            | 100%         | - Completely implemented with leaderboard                               |
| Social            | 100%         | - Completed                               |


## Wireframes:
![Web Display for ParkQuest](https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupP/blob/main/Proposal/Wireframes/Finished/Web-%20wireframe%20V2.png)

### APIs:

| Method | Route                             | Description                                      |
|--------|-----------------------------------|--------------------------------------------------|
| `POST` |  `/register `                     | Add the user to the system                       |
| `POST` |  `/login `                        | Log in the user to the system                    |
| `GET`  |  `/users`                         |  Returns a list of all users                     |
| `GET`  |  `/users/current`                         |  Returns a list of all users                     |
| `GET`  | `/users/id/:userId `                 |  Returns a users by id                           |
| `GET`  | `/users/id/:username `                 |  Returns a users by username                           |
| `POST` | `/users/id/:userId/follow `          | Add a friend to the current user                 |
| `DELETE` | `/users/id/:userId/unfollow/:followedId `          | Remove a friend to the current user                 |
| `GET`  |` /users/id/:userId/following `           | Returns a user follwing list                     |
| `GET`  |` /users/id/:userId/followers `           | Returns a user followers list                     |
| `GET`  | `/users/:userId/visited-parks`          | Returns a visited park's list                    |
| `GET`  | `/posts`                          | Returns a list of all user social posts                    |
| `POST`  | `/posts`                          | Creates a new user social post                    |
| `DELETE`  | `/posts/:postId`                          | Delete a user social post by its ID                    |
| `GET`  | `/national-parks/lat-long`        | Returns the park long and lat from nps.gov       |
| `GET`  | `/national-parks/:parkId`         | Returns a park info from nps.gov by id           |
| `GET`  | `/national-parks/:parkId/latlong` | Returns the park long and lat from nps.gov by id |
| `POST`  | `/national-parks/:parkId/track` | Marks a park as visited by a user |
| `GET`  | `/national-parks-list/name` | Gets list of all national parks |
| `GET`  | `/national-parks-list/details` | Gets list of all national parks with latitude and longitude |


### Database Schema
![DBSchema](https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupP/blob/main/schema/ParkQuest_Schema.png)

### Team Member Contributions

#### [Mauro Petrarulo]

* Offline functionality
* Implemented calculation for determine the distance of the user to the selected park
* Implemented confimed visit park funcionality 

#### [Kyle Curley]

* Added favicon and made app PWA installable
* Added backend register validation
* Added database and created user, friends, and visited park tables
* Added API routes for park visits
* Made styling changes

#### [Joseph Carrasco]

* Implemented Logout functionality on all pages
* Implemented user posts to the social page
* Implemented deleting user posts

#### Milestone Effort Contribution

Mauro Petrarulo| Kyle Curley | Joseph Carrasco
-------------| ------------- | -------------
 33.33%           | 33.33%            | 33.33%

