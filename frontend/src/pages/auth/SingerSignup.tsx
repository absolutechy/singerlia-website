import React from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import LogoBadge from "@/components/auth/LogoBadge";
import SocialButton from "@/components/auth/SocialButton";
import AuthTextField from "@/components/auth/AuthTextField";
import { Button } from "@/components/common";
import Select from "@/components/common/Select";

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

const SingerSignup: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthModalLayout title="Welcome to Sign up" size="lg">
      <div className="space-y-4">
        <LogoBadge size="md" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AuthTextField
            id="firstName"
            label="First Name"
            placeholder="Type here"
            labelClassName="text-xs text-start font-semibold uppercase tracking-[0.16em] text-primary-text"
            inputClassName="mt-2 w-full rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-3 text-sm text-[#8897AD] shadow-inner focus:border-[#B8860B] focus:outline-none"
          />
          <AuthTextField
            id="lastName"
            label="Last Name"
            placeholder="Type here"
            labelClassName="text-xs text-start font-semibold uppercase tracking-[0.16em] text-primary-text"
            inputClassName="mt-2 w-full rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-3 text-sm text-[#8897AD] shadow-inner focus:border-[#B8860B] focus:outline-none"
          />
          <AuthTextField
            id="phone"
            type="tel"
            label="Phone Number"
            placeholder="Type here"
            labelClassName="text-xs text-start font-semibold uppercase tracking-[0.16em] text-primary-text"
            inputClassName="mt-2 w-full rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-3 text-sm text-[#8897AD] shadow-inner focus:border-[#B8860B] focus:outline-none"
          />

          <AuthTextField
            id="email"
            type="email"
            label="Email"
            placeholder="Type here"
            labelClassName="text-xs text-start font-semibold uppercase tracking-[0.16em] text-primary-text"
            inputClassName="mt-2 w-full rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-3 text-sm text-[#8897AD] shadow-inner focus:border-[#B8860B] focus:outline-none"
          />
          <label className="text-xs text-start font-semibold uppercase tracking-[0.16em] text-primary-text">
            Select Gender
            <Select
              placeholder="Select here"
              options={genderOptions}
              className="mt-2 w-full rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-[22px] text-sm text-[#8897AD] shadow-inner focus:border-[#B8860B] focus:outline-none"
            />
          </label>
          <AuthTextField
            id="introVideo"
            type="url"
            label="Introduction Video Link"
            placeholder="Add YouTube video link"
            labelClassName="text-xs text-start font-semibold uppercase tracking-[0.16em] text-primary-text"
            inputClassName="mt-2 w-full rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-3 text-sm text-[#8897AD] shadow-inner focus:border-[#B8860B] focus:outline-none"
          />

          <label className="text-xs text-start font-semibold uppercase tracking-[0.16em] text-primary-text">
            Select Country
            <Select
              placeholder="Select here"
              options={countryOptions}
              className="mt-2 w-full rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-[22px] text-sm text-[#8897AD] shadow-inner focus:border-[#B8860B] focus:outline-none"
            />
          </label>
          <label className="text-xs text-start font-semibold uppercase tracking-[0.16em] text-primary-text">
            Select City
            <Select
              placeholder="Select here"
              options={cityOptions}
              className="mt-2 w-full rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-[22px] text-sm text-[#8897AD] shadow-inner focus:border-[#B8860B] focus:outline-none"
            />
          </label>
          <AuthTextField
            id="location"
            label="Add Location"
            placeholder="Add YouTube video link"
            labelClassName="text-xs text-start font-semibold uppercase tracking-[0.16em] text-primary-text"
            inputClassName="mt-2 w-full rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-3 text-sm text-[#8897AD] shadow-inner focus:border-[#B8860B] focus:outline-none"
          />

          <AuthTextField
            id="password"
            type="password"
            label="Password"
            placeholder="Type here"
            labelClassName="text-xs text-start font-semibold uppercase tracking-[0.16em] text-primary-text"
            inputClassName="mt-2 w-full rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-3 text-sm text-[#8897AD] shadow-inner focus:border-[#B8860B] focus:outline-none"
          />
          <AuthTextField
            id="confirmPassword"
            type="password"
            label="Re-Enter Password"
            placeholder="Type here"
            labelClassName="text-xs text-start font-semibold uppercase tracking-[0.16em] text-primary-text"
            inputClassName="mt-2 w-full rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-3 text-sm text-[#8897AD] shadow-inner focus:border-[#B8860B] focus:outline-none"
          />
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

export default SingerSignup;

