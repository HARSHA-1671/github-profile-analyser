import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000
});

export async function fetchReport(username) {
  const { data } = await api.get(`/profile/${username}`);
  return data;
}

export async function fetchCachedReport(username) {
  const { data } = await api.get(`/profile/${username}/cached`);
  return data;
}

export async function compareProfiles(...usernames) {
  const params = usernames.reduce((accumulator, username, index) => {
    accumulator[`u${index + 1}`] = username;
    return accumulator;
  }, {});

  const { data } = await api.get("/compare", {
    params
  });
  return data;
}

export async function fetchHealth() {
  const { data } = await api.get("/health");
  return data;
}

export default api;
