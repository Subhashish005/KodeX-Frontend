import { useLocation, Navigate, Outlet } from "react-router";
import { useAuth } from "../utils/useAuth";

export const RequiredOAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    auth.oAuthAccessToken ?
    <Outlet /> :
    <Navigate to='/disclaimer' state={{from: location}} replace />
  );
}
