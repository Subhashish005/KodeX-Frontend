import { useLocation, Navigate, Outlet } from "react-router";
import { useAuth } from "../utils/useAuth";

export const RequiredAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    auth.accessToken ?
    <Outlet /> :
    <Navigate to='/login' state={{from: location}} replace />
  );
}
