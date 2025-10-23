import React from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import SocialButton from "@/components/auth/SocialButton";
import { Button, Input } from "@/components/common";
import GoogleIcon from "@/assets/images/common/Google.png";
import FacebookIcon from "@/assets/images/common/Facebook.png";

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <Input 
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              placeholder="Type here"
              className="bg-[#F7FBFF] border border-[#D4D7E3] !pl-2 !py-6"
            />
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm text-primary-text mb-10">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-[#D5CAFF] text-primary focus:ring-[#B8860B]"
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
          onClick={() => navigate("/auth/verification-method")}
        >
          <span className="font-semibold">Sign Up</span>
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
