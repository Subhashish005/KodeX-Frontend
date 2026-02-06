import { createContext, useLayoutEffect, useState } from "react";
import { axiosPrivate } from "../utils/getAxiosInstance";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState({isLoggedIn: false});

  useLayoutEffect(() => {
    const init = async () => {
      await axiosPrivate.get('/api/v1/auth/renew-access-token')
        .then((response) => {

          const token = response.data?.access_token;
          const username = jwtDecode(token).sub;

          setAuth({
            accessToken: token,
            isLoggedIn: true,
            username
          });
        })
        .catch((error) => {
          console.error(error);
        })
    }

    init();

  }, []);

  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  );
}