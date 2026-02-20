import { useAuth } from "./useAuth";
import { axiosPublicInstance } from './getAxiosInstance';

export const useRefreshTokenOAuth = () => {
  const { setAuth } = useAuth();
  let accessToken = null;

  const refreshOAuth = async () => {
    await axiosPublicInstance(
      '/api/v1/refresh-token/google'
    )
    .then(response => {
      if(response.status === 200) {
        accessToken = response.data?.oauth_access_token;

        setAuth(prev => {
          return {
            ...prev,
            oAuthAccessToken: accessToken,
          };
        });
      }
    })
    .catch(error => console.error('error at refresh oauth access token: ' + error));

    return accessToken;
  }

  return refreshOAuth;
}