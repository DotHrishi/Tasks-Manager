import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        login(user, token);
        toast.success("Logged in with Google successfully!");
        navigate("/");
      } catch (e) {
        toast.error("Failed to parse user data.");
        navigate("/login");
      }
    } else {
      toast.error("Authentication failed.");
      navigate("/login");
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="flex justify-center items-center mt-20 w-full text-white">
      Logging you in...
    </div>
  );
};

export default OAuthCallback;
