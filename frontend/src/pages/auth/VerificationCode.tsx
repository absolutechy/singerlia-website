import React, { useState } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import LogoBadge from "@/components/auth/LogoBadge";
import OtpInput from "@/components/auth/OtpInput";
import { Button } from "@/components/common";

const VerificationCode: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  return (
    <AuthModalLayout title="Identify Verification">
      <div className="space-y-8 text-center">
        <LogoBadge size="md" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[#2F1C4E]">
            Text Confirmation
          </h3>
          <p className="text-sm text-[#6F5D9E]">
            A code was sent to XXX-XXX-2121
          </p>
        </div>
        <OtpInput onChange={setCode} />
        <div className="flex flex-col">
          <button
            type="button"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Send again
          </button>
          <Button
            variant="secondary"
            size="large"
            className="mx-auto w-full max-w-sm rounded-full bg-primary text-white hover:bg-[#4A1F6B]"
            onClick={() => navigate("/")}
            disabled={code.length < 6}
          >
            <span className="font-semibold">Done</span>
          </Button>
        </div>
        <p className="text-sm text-[#6F5D9E]">
          Having problems?{" "}
          <a
            href="#"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Let us help and contact us!
          </a>
        </p>
      </div>
    </AuthModalLayout>
  );
};

export default VerificationCode;
