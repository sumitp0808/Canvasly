import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const {token, user} = useSelector((state) => state.auth);

  if(!token) return <Navigate to="/login" />;

  if(!user) return <div>Loading...</div>;
  
  return children;
};

export default RequireAuth;
