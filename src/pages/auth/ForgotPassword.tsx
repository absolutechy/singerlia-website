import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import { Button, Input } from "@/components/common";
import authService from "@/api/services/authService";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
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
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.sendResetPasswordCode({
        phonenumber: phoneNumber,
      });

      console.log("Reset code sent:", response);
      
      // Start timer
      setTimer(60);
      setCanResend(false);

      // Navigate to reset password page with userId and phone number
      navigate("/auth/reset-password", {
        state: {
          userId: response.userId,
          phoneNumber: phoneNumber,
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
              Enter your phone number to receive a verification code
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <Input
              id="phonenumber"
              type="tel"
              placeholder="Phone Number"
              className="bg-[#F7FBFF] border border-[#D4D7E3] !pl-2 !py-6"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
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
