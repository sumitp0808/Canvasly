import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setAuth } from "./authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (res) => {
    try {
        const {data} = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/google`,
          { token: res.credential }
        );

        dispatch(setAuth(data));
        navigate("/dashboard");
    } catch(error) {
        console.log("lOGin Failed(GoogleLoginButton)", error);
    }
  };
  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login FAIled")}
    />
  );
};

export default GoogleLoginButton;
