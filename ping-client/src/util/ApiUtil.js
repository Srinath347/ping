const AUTH_SERVICE = "http://localhost:8081";
const CHAT_SERVICE = "http://localhost:8080";

const request = (options) => {
  const headers = new Headers();

  if (options.setContentType !== false) {
    headers.append("Content-Type", "application/json");
  }

  // if (localStorage.getItem("sender")) {
  //   headers.append(
  //     "Authorization",
  //     "Bearer " + localStorage.getItem("sender")
  //   );
  // }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export function login(loginRequest) {
  return request({
    url: AUTH_SERVICE + "/signin",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
}

export function facebookLogin(facebookLoginRequest) {
  return request({
    url: AUTH_SERVICE + "/facebook/signin",
    method: "POST",
    body: JSON.stringify(facebookLoginRequest),
  });
}

export function signup(signupRequest) {
  return request({
    url: AUTH_SERVICE + "/users",
    method: "POST",
    body: JSON.stringify(signupRequest),
  });
}

export function getCurrentUser() {
  if (!localStorage.getItem("senderId")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: AUTH_SERVICE + "/users/me",
    method: "GET",
  });
}

export function getUsers() {
  // if (!localStorage.getItem("sender")) {
  //   return Promise.reject("No access token set.");
  // }

  // return request({
  //   url: AUTH_SERVICE + "/users/summaries",
  //   method: "GET",
  // });
  const users = {
    "id": 1,
    "username": "Joe"
  }
}

export function countNewMessages(senderId, recipientId) {
  if (!localStorage.getItem("sender")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: CHAT_SERVICE + "/messages/" + senderId + "/" + recipientId + "/count",
    method: "GET",
  });
}

export function findChatMessages(senderId, recipientId) {
  if (!localStorage.getItem("sender")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: CHAT_SERVICE + "/messages/" + senderId + "/" + recipientId,
    method: "GET",
  });
}

export function findChatMessage(id) {
  if (!localStorage.getItem("sender")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: CHAT_SERVICE + "/messages/" + id,
    method: "GET",
  });
}

export function findValidUser(id) {
  if (!localStorage.getItem("sender")) {
    return Promise.reject("No access token set.");
  }

  const url = CHAT_SERVICE + "/verify/" + id;
  return request({
    url: CHAT_SERVICE + "/verify/" + id,
    method: "GET",
  });
}

export function updateUserStatus(id, status) {
  if (!localStorage.getItem("sender")) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: CHAT_SERVICE + "/status/" + id + "/" + status,
    method: "PUT",
  });
}

export function getUserById(id) {
  // if (!localStorage.getItem("sender")) {
  //   return Promise.reject("No access token set.");
  // }

  return request({
    url: CHAT_SERVICE + "/user/" + id,
    method: "GET",
  });
}

export function findIdleUsers(id) {

  return request({
    url: CHAT_SERVICE + "/idle_users" ,
    method: "GET",
  });
}

export function verifyUser(username) {
  
  return request({
    url: AUTH_SERVICE + "/auth/" + username ,
    method: "GET",
  });
}

export function getUserByName(username) {
  
  return request({
    url: CHAT_SERVICE + "/user/username/" + username ,
    method: "GET",
  });
}



