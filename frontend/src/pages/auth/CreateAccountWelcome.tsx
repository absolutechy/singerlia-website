import React from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import LogoBadge from "@/components/auth/LogoBadge";
import { Button } from "@/components/common";

const CreateAccountWelcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthModalLayout title="Create your account">
      <div className="space-y-6 text-center">
        <LogoBadge size="md" />
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-[#2E1B4D]">
            Welcome to Singerlia
          </h3>
          <p className="text-sm text-[#6F5D9E]">
            Woohoo! You’re on your way to saving time and money. Let’s get
            started and make skills management a breeze!
          </p>
        </div>
        <Button
          variant="secondary"
          size="large"
          className="mx-auto w-full max-w-sm rounded-full bg-[#371552] text-white hover:bg-[#4A1F6B]"
          onClick={() => navigate("/auth/choose-role")}
        >
          <span className="font-semibold">Continue</span>
        </Button>
      </div>
    </AuthModalLayout>
  );
};

export default CreateAccountWelcome;
