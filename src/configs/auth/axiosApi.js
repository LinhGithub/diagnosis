import axios from "axios";
import Cookies from "universal-cookie";
import { urlAPI } from "../../settings/Config";

const cookies = new Cookies();

//get token o localStorage
function getLocalToken() {
  const token = localStorage.getItem("token");
  //   console.log("token", token);
  return token;
}

//get token o refreshToken
function getLocalRefreshToken() {
  const token = cookies.get("refreshToken");
  return token;
}

const axiosApi = axios.create({
  baseURL: urlAPI,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosApi.setToken = (token) => {
  axiosApi.defaults.headers["x_authorization"] = token;
  window.localStorage.setItem("token", token);
};

function refreshToken() {
  axiosApi.defaults.headers["x_authorization"] = getLocalToken();
  return axiosApi.post("refresh_token", {
    refreshToken: getLocalRefreshToken(),
  });
}

// response parse
axiosApi.interceptors.response.use(
  (response) => {
    const { code, auto } = response.data;
    // console.log(response.data);
    if (code === 401) {
      if (auto === "yes") {
        return refreshToken().then((rs) => {
          //   console.log("get token refreshToken>>", rs.data);
          const { accessToken } = rs.data;
          axiosApi.setToken(accessToken);
          const config = response.config;
          config.headers["x_authorization"] = accessToken;
          config.baseURL = urlAPI;
          return axiosApi(config);
        });
      }
    }
    return response;
  },
  (error) => {
    console.warn("Error status", error.response.status);
    // return Promise.reject(error)
    if (error.response) {
      return JSON.parse(error.response.data);
    } else {
      return Promise.reject(error);
    }
  }
);

export default axiosApi;
