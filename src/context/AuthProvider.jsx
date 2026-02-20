import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { axiosPublicInstance } from "../utils/getAxiosInstance";
import { jwtDecode } from "jwt-decode";
import { Loading } from "../components/Loading";

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState(
    {
      accessToken: null,
      username: null,
      userId: null,
      isLoggedIn: false,
      oAuthAccessToken: null
    }
  );

  // default start as true to give context a chance to run first
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // check if user has a refresh token if yes then, get an access token
      await axiosPublicInstance(
        '/api/v1/renew-access-token'
      )
      .then(response => {
        if(response.status === 200) {
          const accessToken = response.data?.access_token;
          const decodedToken = jwtDecode(accessToken);
          const username = decodedToken.name;
          const userId = decodedToken.sub;

          setAuth(prev => {
            return {
              ...prev,
              accessToken,
              isLoggedIn: true,
              username,
              userId
            };
          });
        }
      })
      .catch(error => console.error('error at refreshing access token: ' + error));

      await axiosPublicInstance(
        '/api/v1/refresh-token/google'
      )
      .then(response => {
        if(response.status === 200) {
          const accessToken = response.data?.oauth_access_token;

          setAuth(prev => {
            return {
              ...prev,
              oAuthAccessToken: accessToken,
            };
          });
        }
      })
      .catch(error => console.error('error at refresh oauth access token: ' + error));

      setLoading(false);
    }

    init();

  }, []);

  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      {!loading ? children : <Loading />}
    </AuthContext.Provider>
  );
}