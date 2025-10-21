import React from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import LogoBadge from "@/components/auth/LogoBadge";
import AuthTextField from "@/components/auth/AuthTextField";
import SocialButton from "@/components/auth/SocialButton";
import { Button } from "@/components/common";

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthModalLayout title="Welcome to Log In" size="lg">
      <div className="flex flex-col items-center gap-8">
        <LogoBadge size="md" />
        <div className="grid w-full gap-8 md:grid-cols-2 md:gap-12">
          <div className="space-y-9">
            <h3 className="text-lg font-semibold text-[#2F1C4E]">
              Login With Accents
            </h3>
            <SocialButton
              label="Sign in with Google"
              icon={
                <span className="text-lg font-semibold text-[#EA4335]">G</span>
              }
              iconWrapperClassName="border border-[#E5E0FF]"
            />
            <SocialButton
              label="Sign in with Facebook"
              icon={<span className="text-lg font-semibold text-black">f</span>}
              iconWrapperClassName="border border-[#E5E0FF] bg-[#1877F2]"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#2F1C4E]">Login</h3>
            <div className="space-y-3">
              <AuthTextField
                id="email"
                label="Email"
                type="email"
                placeholder="Type here"
                labelClassName="block text-left text-xs font-semibold uppercase tracking-[0.15em] text-[#8D7CC1]"
                inputClassName="mt-2 w-full rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-3 text-sm text-[#2F1C4E] shadow-inner focus:border-[#B8860B] focus:outline-none"
              />
              <AuthTextField
                id="password"
                label="Password"
                type="password"
                placeholder="Type here"
                labelClassName="block text-left text-xs font-semibold uppercase tracking-[0.15em] text-[#8D7CC1]"
                inputClassName="mt-2 w-full rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-3 text-sm text-[#2F1C4E] shadow-inner focus:border-[#B8860B] focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-[#6F5D9E]">
              <label className="inline-flex items-center gap-2 text-primary-text">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#D5CAFF] text-primary-text focus:ring-[#B8860B]"
                />
                Remember Password
              </label>
              <button
                type="button"
                className="text-[#3551B6] underline-offset-4 hover:underline"
              >
                Forgot Password
              </button>
            </div>
          </div>
        </div>
        <Button
          variant="secondary"
          size="large"
          className="w-full max-w-md rounded-full bg-[#371552] text-white hover:bg-[#4A1F6B]"
          onClick={() => navigate("/auth/signup")}
        >
          <span className="font-semibold">Log In</span>
        </Button>
      </div>
    </AuthModalLayout>
  );
};

export default Login;
