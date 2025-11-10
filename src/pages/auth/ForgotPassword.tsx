import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import { Button, Input } from "@/components/common";
import authService from "@/api/services/authService";
import { Mail, Phone } from "lucide-react";

type VerificationType = "email" | "phone";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [verificationType, setVerificationType] = useState<VerificationType>("phone");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleSendCode = async () => {
    // Validation
    if (!contact.trim()) {
      setError(`Please enter your ${verificationType === "phone" ? "phone number" : "email address"}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const requestData: any = {
        fromphonenumber: verificationType === "phone",
      };

      if (verificationType === "phone") {
        requestData.phonenumber = contact;
      } else {
        requestData.email = contact;
      }

      const response = await authService.sendResetPasswordCode(requestData);

      console.log("Reset code sent:", response);
      
      // Start timer
      setTimer(60);
      setCanResend(false);

      // Navigate to reset password page with userId and contact info
      navigate("/auth/reset-password", {
        state: {
          userId: response.userId,
          contact: contact,
          verificationType: verificationType,
        },
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModalLayout title="Forgot Password" size="md">
      <div className="flex flex-col items-center gap-8">
        <div className="w-full space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-black">
              Reset Your Password
            </h3>
            <p className="text-sm text-gray-600">
              Choose how you'd like to receive your verification code
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Verification Method Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#2F1C4E]">
              Verification Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setVerificationType("phone");
                  setContact("");
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  verificationType === "phone"
                    ? "border-primary bg-[#F8F4FF] text-primary shadow-[0_8px_16px_-12px_rgba(55,21,82,0.35)]"
                    : "border-[#E8DEFF] bg-white text-[#6F5D9E] hover:border-[#CBB9FF]"
                }`}
              >
                <Phone className="h-4 w-4" />
                Phone
              </button>
              <button
                type="button"
                onClick={() => {
                  setVerificationType("email");
                  setContact("");
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  verificationType === "email"
                    ? "border-primary bg-[#F8F4FF] text-primary shadow-[0_8px_16px_-12px_rgba(55,21,82,0.35)]"
                    : "border-[#E8DEFF] bg-white text-[#6F5D9E] hover:border-[#CBB9FF]"
                }`}
              >
                <Mail className="h-4 w-4" />
                Email
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <Input
              id="contact"
              type={verificationType === "phone" ? "tel" : "email"}
              placeholder={verificationType === "phone" ? "Phone Number" : "Email Address"}
              className="bg-[#F7FBFF] border border-[#D4D7E3] !pl-2 !py-6"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                setError("");
              }}
            />
          </div>

          <Button
            variant="secondary"
            size="large"
            className="w-full rounded-full bg-primary text-white hover:bg-[#4A1F6B]"
            onClick={handleSendCode}
            disabled={loading || !canResend}
          >
            <span className="font-semibold">
              {loading
                ? "Sending Code..."
                : !canResend
                ? `Resend in ${timer}s`
                : "Send Verification Code"}
            </span>
          </Button>

          {timer > 0 && (
            <p className="text-center text-sm text-gray-600">
              Didn't receive the code? You can request a new one in {timer}{" "}
              seconds
            </p>
          )}

          <Button
            className="!text-primary btn-text !text-base border border-primary underline-offset-4 hover:underline w-full"
            onClick={() => navigate("/auth/login")}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </AuthModalLayout>
  );
};

export default ForgotPassword;
