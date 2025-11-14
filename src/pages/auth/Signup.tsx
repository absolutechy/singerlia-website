import React, { useState } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import { Button, Input } from "@/components/common";
import authService from "@/api/services/authService";

const fields = [
  { id: "firstName", label: "First Name", type: "text", required: true },
  { id: "lastName", label: "Last Name", type: "text", required: true },
  { id: "phone", label: "Phone Number", type: "tel", required: true },
  { id: "email", label: "Email", type: "email", required: true },
  { id: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
  { id: "iqamaNumber", label: "ID / Iqama Number", type: "text", required: true },
  { id: "password", label: "Password", type: "password", required: true },
  { id: "confirmPassword", label: "Re-Enter Password", type: "password", required: true },
];

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    iqamaNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // Special handling for Iqama number - only allow numbers and max 10 digits
    if (id === "iqamaNumber") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-digits
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, [id]: numericValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
    
    setError("");
  };

  const handleSignup = async () => {
    // Validation for required fields
    if (!formData.firstName || !formData.lastName || !formData.phone || 
        !formData.email || !formData.dateOfBirth || !formData.iqamaNumber || 
        !formData.password || !formData.confirmPassword) {
      console.log("Missing fields:", formData);
      setError("Please fill in all required fields");
      return;
    }


    // Validate date of birth (must be 18 years or older)
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      setError("You must be at least 18 years old to sign up");
      return;
    }

    // Validate Iqama number (must be exactly 10 digits)
    const iqamaRegex = /^\d{10}$/;
    if (!iqamaRegex.test(formData.iqamaNumber)) {
      setError("Iqama number must be exactly 10 digits");
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
        iqama_number: formData.iqamaNumber,
        DOB: formData.dateOfBirth,
      });

      console.log("Registration successful:", response);

      // Store token and user info for auto-login
      // Some backend variants return token in different shapes; cast to `any` to safely check.
      if ((response as any).token) {
        localStorage.setItem("authToken", (response as any).token);
        localStorage.setItem("userId", response.userId || "");
        localStorage.setItem("userName", `${formData.firstName} ${formData.lastName}`);
        localStorage.setItem("userRole", "user");

        // Dispatch auth event to update header
        // Emit a global auth change event for any listeners (header, etc.)
        window.dispatchEvent(new Event("authChanged"));
        // Navigate to profile/dashboard instead of login
        navigate("/dashboard");
      } else {
        // If no token returned, go to verification
        sessionStorage.setItem("userId", response.userId);
        sessionStorage.setItem("userPhone", formData.phone);
        sessionStorage.setItem("userEmail", formData.email);
        sessionStorage.setItem("userRole", "user");
        navigate("/auth/verification-method");
      }
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
          Don't have an account?{" "}
          <button
            type="button"
            className="font-semibold cursor-pointer text-primary underline-offset-4 hover:underline"
            onClick={() => navigate("/auth/login")}
          >
            Log In
          </button>
        </p>
      }
      title="Welcome to SingerLia Sign Up"
      size="lg"
    >
      <div className="space-y-4 pt-[430px] lg:pt-0">
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
              required={field.required}
              maxLength={field.id === "iqamaNumber" ? 10 : undefined}
              pattern={field.id === "iqamaNumber" ? "[0-9]*" : undefined}
              inputMode={field.id === "iqamaNumber" ? "numeric" : undefined}
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
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline hover:text-primary/80"
            >
              Terms of Service
            </a>
            {" "}and{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline hover:text-primary/80"
            >
              Privacy Policy
            </a>
            .
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
        {/* <div className="grid gap-3 md:grid-cols-2">
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
        </div> */}
      </div>
    </AuthModalLayout>
  );
};

export default Signup;
