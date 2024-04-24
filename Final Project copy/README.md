# [ParkQuest]
## Group [P]: Milestone 2


[ Milestone Report Here ]
### What is Done:
The project now has a working database to store user and park information. There is also working token authentication to allow users to login and also create 
an account. Passwords are saved in the database with a hashed salt and the passwords are hashed themselves to add security to the application. Our API Routes
are also working and help in creating most of our dynamic web pages that we implemented.

### What is Not Done:
There is still work to be done to completely finish the pages. Some of the functionality on the pages are not implemented yet, like seeing the location of the parks
and marking a park as visited for the user. There are also database tables that may need to be added also to have full functioanlity for our application.

### Authentication:
Our application implements authorization using JWT tokens using the jsonwebtoken package. These tokens are saved in a cookie called ParkQuest. The token
contains general information on the current user logged in excluding the user's salt and hashed password. API endpoints also use middleware called TokenMiddleware
that checks whether the user is logged in. If they are not, they will not be able to access any of the web pages and api endpoints until they are logged in.
If a user is not logged in on a webpage, they will be redirected to the login page.

### Web Page Progress

| HTML PAGES           | % completed | TO DO                                                                   |
|----------------------|-------------|-------------------------------------------------------------------------|
| Template Page        | 90%         | - Adding user info to the top bar                                       |
| Login/Signup         | 100%        | - Completely implemented with token authentication and hashing          |
| Progress / Milestone | 80%         | - Add charts / combined progress and milestone pages                    |
| Find Park            | 100%        | - Completed                                                                       |
| Home Page            | 70%         | - Need to implement camera, park select drop down completed             |
| Profile              | 80%         | - Add edit functionality                                                |
| Images               | 0%          |                                                                         |
| Add Friends          | 90%         | - Some buttons for seeing friend requests need to be added              |
| History              | 75%         | - Need to make it dynamically load data                                 |
| Community            | 100%         | - Completely implemented with leaderboard                               |

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
| `GET`  | `/national-parks/lat-long`        | Returns the park long and lat from nps.gov       |
| `GET`  | `/national-parks/:parkId`         | Returns a park info from nps.gov by id           |
| `GET`  | `/national-parks/:parkId/latlong` | Returns the park long and lat from nps.gov by id |
| `POST`  | `/national-parks/:parkId/track` | Marks a park as visited by a user |
| `GET`  | `/national-parks-list/name` | Gets list of all national parks |
| `GET`  | `/national-parks-list/details` | Gets list of all national parks with latitude and longitude |


### Database Schema
![DBSchema](https://github.ncsu.edu/engr-csc342/csc342-2024Spring-GroupP/blob/main/images/ParkQuest_Schema.png)

### Team Member Contributions

#### [Mauro Petrarulo]

* Fixed routing issue
* Implemented dynamic map in the Home page
* Integration of list of parks in the map
* Added API to retrive park informations from nps.gov  

#### [Kyle Curley]

* Added database and created user, friends, and visited park tables
* Implemented progress and profile page
* Created ParkDAO to mark visited parks and and get list of users visited parks
* Added API routes for park visits

#### [Joseph Carrasco]

* Implemented user authorization and register
* Created Token middleware
* Implemented html pages: Community and Add Friends.html
* Created UserDAO to get user related information from database

#### Milestone Effort Contribution

Mauro Petrarulo| Kyle Curley | Joseph Carrasco
-------------| ------------- | -------------
 33.33%           | 33.33%            | 33.33%

