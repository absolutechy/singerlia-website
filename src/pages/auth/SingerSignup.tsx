import React, { useState } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import { Button, Input, Select } from "@/components/common";
import authService from "@/api/services/authService";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const cityOptions = [
  { value: "riyadh", label: "Riyadh" },
  { value: "jeddah", label: "Jeddah" },
  { value: "mecca", label: "Mecca" },
  { value: "medina", label: "Medina" },
  { value: "dammam", label: "Dammam" },
  { value: "khobar", label: "Khobar" },
  { value: "dhahran", label: "Dhahran" },
  { value: "taif", label: "Taif" },
  { value: "buraidah", label: "Buraidah" },
  { value: "tabuk", label: "Tabuk" },
  { value: "khamis-mushait", label: "Khamis Mushait" },
  { value: "hail", label: "Hail" },
  { value: "najran", label: "Najran" },
  { value: "jubail", label: "Jubail" },
  { value: "abha", label: "Abha" },
  { value: "yanbu", label: "Yanbu" },
  { value: "al-qatif", label: "Al Qatif" },
  { value: "al-mubarraz", label: "Al Mubarraz" },
  { value: "al-ahsa", label: "Al Ahsa" },
];

const selects = [
    { id: "gender", label: "Select Gender", options: genderOptions },
    { id: "city", label: "Select City", options: cityOptions },
  ];

const fields = [
    { id: "firstName", label: "First Name", placeholder: "Type here", required: true },
    { id: "lastName", label: "Last Name", placeholder: "Type here", required: true },
    { id: "phone", label: "Phone Number", type: "tel", placeholder: "Type here", required: true },
    { id: "email", label: "Email", type: "email", placeholder: "Type here", required: true },
    { id: "dateOfBirth", label: "Date of Birth", type: "date", placeholder: "Type here", required: true },
    { id: "iqamaNumber", label: "Iqama Number", type: "text", placeholder: "Type here", required: true },
    { id: "introVideo", label: "Introduction Video Link", type: "url", placeholder: "Add YouTube video link" },
    { id: "location", label: "Add Location", placeholder: "Type here" },
    { id: "password", label: "Password", type: "password", placeholder: "Type here", required: true },
    { id: "confirmPassword", label: "Re-Enter Password", type: "password", placeholder: "Type here", required: true },
  ];

const SingerSignup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    iqamaNumber: "",
    introVideo: "",
    location: "",
    password: "",
    confirmPassword: "",
    gender: "",
    city: "",
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

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleSignup = async () => {
    // Validation for required fields
    if (!formData.firstName || !formData.lastName || !formData.phone || 
        !formData.email || !formData.dateOfBirth || !formData.iqamaNumber || 
        !formData.password || !formData.confirmPassword) {
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
        DOB: formData.dateOfBirth,
        iqama_number: formData.iqamaNumber,
      });

      // Store userId and phone for verification page
      sessionStorage.setItem("userId", response.userId);
      sessionStorage.setItem("userPhone", formData.phone);
      sessionStorage.setItem("userEmail", formData.email);
      sessionStorage.setItem("userRole", "singer");
      
      // Navigate directly to verification code page
      // navigate("/auth/verification-code");
      navigate("/auth/verification-method");
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
      <div className="space-y-2 pt-[800px] lg:pt-0">
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
              required={field.required}
              maxLength={field.id === "iqamaNumber" ? 10 : undefined}
              pattern={field.id === "iqamaNumber" ? "[0-9]*" : undefined}
              inputMode={field.id === "iqamaNumber" ? "numeric" : undefined}
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

export default SingerSignup;
