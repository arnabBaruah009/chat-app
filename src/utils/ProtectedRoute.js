import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const checkUser = () => {
    if (!currentUser) {
      return navigate("/");
    }
    setIsLoggedIn(true);
  };

  useEffect(() => {
    checkUser();
  }, [isLoggedIn, currentUser]);

  return <>{isLoggedIn ? props.children : null}</>;
};
export default ProtectedRoute;
