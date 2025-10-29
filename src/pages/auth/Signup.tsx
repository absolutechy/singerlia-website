import React, { useState } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import SocialButton from "@/components/auth/SocialButton";
import { Button, Input } from "@/components/common";
import GoogleIcon from "@/assets/images/common/Google.png";
import FacebookIcon from "@/assets/images/common/Facebook.png";
import authService from "@/api/services/authService";

const fields = [
  { id: "firstName", label: "First Name", type: "text" },
  { id: "lastName", label: "Last Name", type: "text" },
  { id: "phone", label: "Phone Number", type: "tel" },
  { id: "email", label: "Email", type: "email" },
  { id: "password", label: "Password", type: "password" },
  { id: "confirmPassword", label: "Re-Enter Password", type: "password" },
];

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleSignup = async () => {
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.register("user", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phonenumber: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      // Store userId and OTP for verification page
      sessionStorage.setItem("userId", response.userId);
      sessionStorage.setItem("userPhone", formData.phone);
      
      // Navigate to verification method selection
      navigate("/auth/verification-method");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModalLayout
      footerNote={
        <p className="text-center text-sm text-[#6F5D9E]">
          Already have an account?{" "}
          <button
            type="button"
            className="font-semibold text-primary underline-offset-4 hover:underline"
            onClick={() => navigate("/auth/login")}
          >
            Log In
          </button>
        </p>
      }
      title="Welcome to Sign up"
      size="lg"
    >
      <div className="space-y-4 pt-96 lg:pt-0">
        {/* <LogoBadge size="lg" /> */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <Input 
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              placeholder="Type here"
              className="bg-[#F7FBFF] border border-[#D4D7E3] !pl-2 !py-6"
              value={formData[field.id as keyof typeof formData]}
              onChange={handleInputChange}
            />
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm text-primary-text mb-10">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-[#D5CAFF] text-primary focus:ring-[#B8860B]"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <h6>
            I agree to the{" "}
            <span className="font-semibold">Terms of Service</span> and{" "}
            <span className="font-semibold">Privacy Policy</span>.
          </h6>
        </label>
        <Button
          variant="secondary"
          size="large"
          className="mx-auto w-full max-w-md rounded-full bg-primary text-white hover:bg-[#4A1F6B]"
          onClick={handleSignup}
          disabled={loading}
        >
          <span className="font-semibold">{loading ? "Signing Up..." : "Sign Up"}</span>
        </Button>
        <div className="grid gap-3 md:grid-cols-2">
          <SocialButton
            label="Sign in with Google" 
            icon={
              <img src={GoogleIcon} alt="Google" className="h-6 w-6" />
            }
          />
          <SocialButton
            label="Sign in with Facebook"
            icon={<img src={FacebookIcon} alt="Facebook" className="h-7 w-7" />}
          />
        </div>
      </div>
    </AuthModalLayout>
  );
};

export default Signup;
