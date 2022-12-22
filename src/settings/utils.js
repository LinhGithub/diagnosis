import Cookies from "universal-cookie";
const cookies = new Cookies();

export const isAuth = () => {
  const token = localStorage.getItem("token");
  const refreshToken = cookies.get("refreshToken");
  if (token && refreshToken) {
    return true;
  }
  return false;
};
