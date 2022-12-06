const AUTH_SERVICE = "http://localhost:8081";
const CHAT_SERVICE = "http://localhost:8080";

const request = (options) => {
  const headers = new Headers();

  if (options.setContentType !== false) {
    headers.append("Content-Type", "application/json");
  }

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



