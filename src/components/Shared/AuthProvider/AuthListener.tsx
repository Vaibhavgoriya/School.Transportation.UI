import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthSessionManager from "../../../Utils/AuthSessionManager";
import { RoutePaths } from "../../../Constants";

const AuthListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutHandler = () => {
      navigate(RoutePaths.Login);
    };

    AuthSessionManager.onLogout(logoutHandler);

    return () => {
      AuthSessionManager.removeLogout(logoutHandler);
    };

  }, [navigate]);

  return null;
};

export default AuthListener;
