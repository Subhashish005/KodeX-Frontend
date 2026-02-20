import { axiosPublicInstance } from "./getAxiosInstance.js";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./useAuth.js";

export const useRefreshToken = () => {
  const { setAuth } = useAuth();
  let accessToken = null;

  const refresh = async () => {
    await axiosPublicInstance(
      '/api/v1/renew-access-token'
    )
    .then(response => {
      if(response.status === 200) {
        accessToken = response.data?.access_token;
        const username = jwtDecode(accessToken).name;

        setAuth(prev => {
          return {
            ...prev,
            accessToken,
            isLoggedIn: true,
            username
          };
        });
      }
    })
    .catch(error => console.error('error at refreshing token: ' + error));

    return accessToken;
  }

  return refresh;
}