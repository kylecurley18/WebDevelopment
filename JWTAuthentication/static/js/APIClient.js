import HTTPClient from "./HTTPClient.js";

const API_BASE = `./api`;



const getCounties = () => {
  return HTTPClient.get(`${API_BASE}/counties`);
};

const getCountyById = (id) => {
  return HTTPClient.get(`${API_BASE}/counties/${id}`);
};

const getParks = () => {
  return HTTPClient.get(`${API_BASE}/parks`);
};

const getParkById = (id) => {
  return HTTPClient.get(`${API_BASE}/parks/${id}`);
};

const getParksByCountyId = (countyId) => {
  if(countyId == "all") {
    return getParks();
  }
  return HTTPClient.get(`${API_BASE}/counties/${countyId}/parks`);
};

const getCurrentUser = () => {
  return HTTPClient.get(`${API_BASE}/users/current`);
};

const logIn = (username, password) => {
  const data = {
    username: username,
    password: password
  }
  return HTTPClient.post(`${API_BASE}/users/login`, data);
};

const logOut = () => {
  return HTTPClient.post(`${API_BASE}/users/logout`, {});
};


export default {
  getCounties,
  getCountyById,
  getParks,
  getParkById,
  getParksByCountyId,
  getCurrentUser,
  logIn,
  logOut
};



