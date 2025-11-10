import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import { Button, Input } from "@/components/common";
import authService from "@/api/services/authService";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "", // Can be phone or email
    password: "",
  });
  const [rememberPassword, setRememberPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is already authenticated
  useEffect(() => {
    console.log("Checking auth in Login page");
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          await authService.checkAuth();
          console.log("Hello");
          navigate("/"); // Redirect to home if already logged in
        } catch (err) {
          // Token invalid, continue with login
          authService.logout();
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleLogin = async () => {
    // Validation
    if (!formData.identifier || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Determine if identifier is email or phone
      const isEmail = formData.identifier.includes('@');
      
      const loginData: any = {
        password: formData.password,
      };

      if (isEmail) {
        loginData.email = formData.identifier;
      } else {
        loginData.phonenumber = formData.identifier;
      }

      const response = await authService.login(loginData);

      // Success! Token is already stored by authService
      console.log("Login successful:", response.user_metadata);
      
      // Navigate based on user role
      if (response.user_metadata.role === "singer") {
        navigate("/")
        // navigate("/dashboard/singer");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModalLayout 
      title="Welcome to Log In" size="lg"
      footerNote={
        <p className="text-center text-sm text-[#6F5D9E]">
          Don't have an account?{" "}
          <button
            type="button"
            className="font-semibold cursor-pointer text-primary underline-offset-4 hover:underline"
            onClick={() => navigate("/auth/choose-role")}
          >
            Sign Up
          </button>
        </p>
      }
    >
      <div className="flex flex-col items-center gap-8">
        {/* <LogoBadge size="md" /> */}
        <div className="grid w-full items-center gap-8 md:grid-cols-1 md:gap-12">
          {/* <div className="space-y-9 order-2 ">
            <h3 className="text-lg font-semibold text-black">
              Login With Accounts
            </h3>
            <div className="flex flex-row md:flex-col gap-y-9 gap-x-3">
            <SocialButton
              label="Sign in with Google"
              icon={<img src={GoogleIcon} alt="Google" className="h-6 w-6" />}
            />
            <SocialButton
              label="Sign in with Facebook"
              icon={
                <img src={FacebookIcon} alt="Facebook" className="h-7 w-7" />
              }
            />
            </div>
          </div> */}
          <div className="md:w-[500px] w-full mx-auto">
            <div className="space-y-5 md:space-y-9">
              <h3 className="text-xl text-start font-semibold">Login</h3>
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              <Input
                id="identifier"
                // label="Phone Number or Email"
                type="text"
                placeholder="Phone Number or Email"
                className="bg-[#F7FBFF] border border-[#D4D7E3] !pl-2 !py-6"
                value={formData.identifier}
                onChange={handleInputChange}
              />
              <Input
                id="password"
                // label="Password"
                type="password"
                placeholder="Password"
                className="bg-[#F7FBFF] !font-sans border border-[#D4D7E3] !pl-2 py-6"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center text-sm text-[#6F5D9E] mt-3">
              <label className="inline-flex items-center gap-2 text-primary-text">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#D5CAFF] text-primary-text focus:ring-[#B8860B]"
                  checked={rememberPassword}
                  onChange={(e) => setRememberPassword(e.target.checked)}
                />
                Remember Password
              </label>
            </div>
          </div>
        </div>
        <Button
          variant="secondary"
          size="large"
          className="w-full max-w-md rounded-full bg-primary text-white hover:bg-[#4A1F6B]"
          onClick={handleLogin}
          disabled={loading}
        >
          <span className="font-semibold">{loading ? "Logging In..." : "Log In"}</span>
        </Button>
        <Button
          // variant="primary"
          className="!text-primary btn-text !text-base border border-primary underline-offset-4 hover:underline"
          onClick={() => navigate("/auth/forgot-password")}
        >
          Forgot Password
        </Button>
      </div>
    </AuthModalLayout>
  );
};

export default Login;
