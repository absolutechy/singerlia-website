import React, { useState } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import SocialButton from "@/components/auth/SocialButton";
import { Button, Input, Select } from "@/components/common";
import GoogleIcon from "@/assets/images/common/Google.png";
import FacebookIcon from "@/assets/images/common/Facebook.png";
import authService from "@/api/services/authService";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "uae", label: "United Arab Emirates" },
];

const cityOptions = [
  { value: "nyc", label: "New York" },
  { value: "ldn", label: "London" },
  { value: "dxb", label: "Dubai" },
];

const selects = [
    { id: "gender", label: "Select Gender", options: genderOptions },
    { id: "country", label: "Select Country", options: countryOptions },
    { id: "city", label: "Select City", options: cityOptions },
  ];

const fields = [
    { id: "firstName", label: "First Name", placeholder: "Type here" },
    { id: "lastName", label: "Last Name", placeholder: "Type here" },
    { id: "phone", label: "Phone Number", type: "tel", placeholder: "Type here" },
    { id: "email", label: "Email", type: "email", placeholder: "Type here" },
    { id: "introVideo", label: "Introduction Video Link", type: "url", placeholder: "Add YouTube video link" },
    { id: "location", label: "Add Location", placeholder: "Type here" },
    { id: "password", label: "Password", type: "password", placeholder: "Type here" },
    { id: "confirmPassword", label: "Re-Enter Password", type: "password", placeholder: "Type here" },
  ];

const SingerSignup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    introVideo: "",
    location: "",
    password: "",
    confirmPassword: "",
    gender: "",
    country: "",
    city: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleSelectChange = (id: string, value: string) => {
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
      const response = await authService.register("singer", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phonenumber: formData.phone,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        intro_vid_link: formData.introVideo,
        city: formData.city,
        address: formData.location,
      });

      // Store userId and phone for verification page
      sessionStorage.setItem("userId", response.userId);
      sessionStorage.setItem("userPhone", formData.phone);
      sessionStorage.setItem("userRole", "singer");
      
      // Navigate directly to verification code page
      navigate("/auth/verification-code");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModalLayout
      title="Welcome to Sign up"
      footerNote={
        <p className="text-center text-sm text-[#6F5D9E]">
          Already have an account?{" "}
          <button
            type="button"
            className="font-semibold cursor-pointer text-primary underline-offset-4 hover:underline"
            onClick={() => navigate("/auth/login")}
          >
            Log In
          </button>
        </p>
      }
      size="xl"
    >
      <div className="space-y-2 pt-[850px] lg:pt-0">
        {/* <LogoBadge size="md" /> */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          {selects.map((select) => (
            <Select 
              key={select.label}
              label={select.label}
              options={select.options}
              className="bg-[#F7FBFF] border border-[#D4D7E3] !pl-2 !py-6"
              value={formData[select.id as keyof typeof formData]}
              onChange={(value) => handleSelectChange(select.id, value)}
            />
          ))}
        </div>

        <label className="flex items-center gap-3 text-sm text-[#6F5D9E] mb-10">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-[#D5CAFF] text-primary focus:ring-[#B8860B]"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <span>
            I agree to the{" "}
            <span className="font-semibold">Terms of Service</span> and{" "}
            <span className="font-semibold">Privacy Policy</span>.
          </span>
        </label>

        <Button
          variant="secondary"
          size="large"
          className="mx-auto w-full max-w-md rounded-full bg-primary text-white hover:bg-[#4A1F6B] mb-5"
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

export default SingerSignup;
