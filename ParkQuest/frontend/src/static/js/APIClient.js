import HTTPClient from "./HTTPClient.js";

const API_BASE = `./api`;

const logIn = (username, password) => {
  const data = {
    username: username,
    password: password
  }
  return HTTPClient.post(`${API_BASE}/login`, data);
};

const logOut = () => {
  return HTTPClient.post(`${API_BASE}/logout`, {});
};

const getCurrentUser = () => {
  return HTTPClient.get(`${API_BASE}/users/current`);
};

const getUsers = () => {
  return HTTPClient.get(`${API_BASE}/users`);
}

const getUserById = (userId) => {
  return HTTPClient.get(`${API_BASE}/users/id/` + userId);
}

const postUser = (username, first_name, last_name, password, email) => {
  const data = {
    username: username,
    first_name: first_name,
    last_name: last_name,
    password: password,
    email: email
  }

  return HTTPClient.post(`${API_BASE}/register`, data);
}

const followUser = (currentId, followId) => {
  const data = {
    userId: followId
  }

  return HTTPClient.post(`${API_BASE}/users/id/` + currentId + `/follow`, data);
}

const unFollowUser = (currentId, followId) => {
  return HTTPClient.delete(`${API_BASE}/users/id/` + currentId + `/unfollow/` + followId);
}

const getUserFollowing = (userId) => {
  return HTTPClient.get(`${API_BASE}/users/id/` + userId + `/following`,);
}

const getUserFollowers = (userId) => {
  return HTTPClient.get(`${API_BASE}/users/id/` + userId + `/followers`,);
}

const getPosts = () => {
  return HTTPClient.get(`${API_BASE}/posts`);
}

const createPost = (user, postText) => {
  const data = {
    userId: user.id,
    text: postText
  };

  return HTTPClient.post(`${API_BASE}/posts`, data);
}

const deletePost = (post) => {
  return HTTPClient.delete(`${API_BASE}/posts/` + post.id);
}

const getParkNames = () => {
  return HTTPClient.get(`${API_BASE}/national-parks-list/name`);
};

const getParkDetails = () => {
  return HTTPClient.get(`${API_BASE}/national-parks-list/details`);
};

const getVisitedParks = (userId) => {
  return HTTPClient.get(`${API_BASE}/users/${userId}/visited-parks`);
};

const getParkDetailsById = (parkId) => {
  return HTTPClient.get(`${API_BASE}/national-parks/${parkId}`);
};





const getConfirmVisit = (park, currentUserId) => {


  return HTTPClient.post(`${API_BASE}/national-parks-list/${park.id}/visit/`, { userId: currentUserId });
}

export default {
  logIn,
  logOut,
  getCurrentUser,
  getUsers,
  getUserById,
  postUser,
  followUser,
  unFollowUser,
  getUserFollowing,
  getUserFollowers,
  getPosts,
  createPost,
  deletePost,
  getParkNames,
  getParkDetails,
  getVisitedParks,
  getParkDetailsById,
  getConfirmVisit
};



