import { axiosPrivateInstance } from "./utils/getAxiosInstance";

export const Test = () => {
  const redirectURL = 'http://localhost:8080/api/v1/oauth2/login/google?user_id=1';

  return (
    <>
      <button
        onClick={() => {
          window.location.href=redirectURL;
        }}
        style={{color: "white"}}
      >
        hit for redirect hopefully :)
      </button>
    </>
  )
}