import { useAuth } from "./useAuth";
import { useRefreshToken } from "./useRefreshToken"
import { axiosPrivateInstance } from "./getAxiosInstance";
import { useEffect } from "react";
import { useRefreshTokenOAuth } from "./useRefreshTokenOAuth";

// this will retry 2 times since count starts from 0
const MAX_RETRIES = 1;

export const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const refreshOAuth = useRefreshTokenOAuth();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivateInstance.interceptors.request.use(
      async (config) => {
        if(!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
        }

        if(!config.headers['OAuthAccessToken']) {
          config.headers['OAuthAccessToken'] = `Bearer ${auth?.oAuthAccessToken}`;
        }

        return config;
      }, (error) => {Promise.reject(error);}
    );

    const responseIntercept = axiosPrivateInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const prevRequest = error?.config;

        if(!prevRequest.retries)
          prevRequest.retries = 0;

        // if error code is 403 then something went wrong horribly :')
        if((error?.status === 401 || error?.status === 403) && prevRequest.retries < MAX_RETRIES ) {
          ++prevRequest.retries;

          let newAccessToken = auth.accessToken;
          let newOAuthAccessToken = auth.oAuthAccessToken;

          if(error.response?.data?.error_code === 'INVALID_TOKEN')
            newAccessToken = await refresh();

          newOAuthAccessToken = await refreshOAuth();

          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          prevRequest.headers['OAuthAccessToken'] = `Bearer ${newOAuthAccessToken}`;

          return axiosPrivateInstance(prevRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      // remove interceptors so they don't pile up

      axiosPrivateInstance.interceptors.request.eject(requestIntercept);
      axiosPrivateInstance.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivateInstance;
}