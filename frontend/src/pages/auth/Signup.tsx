import React from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import LogoBadge from "@/components/auth/LogoBadge";
import SocialButton from "@/components/auth/SocialButton";
import { Button } from "@/components/common";

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
    <AuthModalLayout title="Welcome to Sign up" size="lg">
      <div className="space-y-8">
        <LogoBadge size="md" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <label
              key={field.id}
              htmlFor={field.id}
              className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8D7CC1]"
            >
              {field.label}
              <input
                id={field.id}
                type={field.type}
                placeholder="Type here"
                className="mt-2 w-full rounded-2xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-3 text-sm text-[#2F1C4E] shadow-inner focus:border-[#B8860B] focus:outline-none"
              />
            </label>
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm text-[#6F5D9E]">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-[#D5CAFF] text-[#371552] focus:ring-[#B8860B]"
          />
          <span>
            I agree to the <span className="font-semibold">Terms of Service</span> and{" "}
            <span className="font-semibold">Privacy Policy</span>.
          </span>
        </label>
        <Button
          variant="secondary"
          size="large"
          className="mx-auto w-full max-w-md rounded-full bg-[#371552] text-white hover:bg-[#4A1F6B]"
          onClick={() => navigate("/auth/verification-method")}
        >
          <span className="font-semibold">Sign Up</span>
        </Button>
        <div className="grid gap-3 md:grid-cols-2">
          <SocialButton
            label="Sign in with Google"
            icon={<span className="text-lg font-semibold text-[#EA4335]">G</span>}
            iconWrapperClassName="border border-[#E5E0FF]"
          />
          <SocialButton
            label="Sign in with Facebook"
            icon={<span className="text-lg font-semibold text-white">f</span>}
            iconWrapperClassName="border border-[#E5E0FF] bg-[#1877F2]"
          />
        </div>
        <p className="text-center text-sm text-[#6F5D9E]">
          Don’t you have an account?{" "}
          <button
            type="button"
            className="font-semibold text-[#371552] underline-offset-4 hover:underline"
            onClick={() => navigate("/auth/login")}
          >
            Sign Up
          </button>
        </p>
      </div>
    </AuthModalLayout>
  );
};

export default Signup;
