import { useAuth } from "./useAuth";
import { axiosPublic } from "./getService";

export const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const accessToken = null;

    await axiosPublic(
      '/api/v1/auth/renew-access-token',
      { withCredentials: true }
    ).then(response => {
      if(response.status === 200) {
        setAuth(prev => {
          return {...prev, accessToken: response.data?.access_token};
        });

        accessToken = response.data?.access_token;
      }

    }).catch(error => {
      console.error('error at refreshing token: ' + error);

      setAuth(prev => {
        return {...prev, accessToken: null};
      });

    });

    return accessToken;
  }

  return refresh;
}