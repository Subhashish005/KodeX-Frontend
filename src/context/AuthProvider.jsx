import { createContext, useLayoutEffect, useState } from "react";
import { axiosPublic } from "../utils/getAxiosInstance";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState(
    {
      accessToken: null,
      username: null,
      isLoggedIn: false
    }
  );

  useLayoutEffect(() => {
    const init = async () => {
      await axiosPublic(
        '/api/v1/renew-access-token'
      )
      .then(response => {
        if(response.status === 200) {
          const accessToken = response.data?.access_token;
          const username = jwtDecode(accessToken).sub;

          setAuth(prev => {
            return {
              ...prev,
              accessToken,
              isLoggedIn: true,
              username
            };
          });
        }})
      .catch(error => {
        console.error('error at refreshing token: ' + error);
      });
    }

    init();

  }, []);

  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  );
}