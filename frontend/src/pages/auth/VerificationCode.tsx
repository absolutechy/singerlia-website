import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import LogoBadge from "@/components/auth/LogoBadge";
import OtpInput from "@/components/auth/OtpInput";
import { Button } from "@/components/common";
import authService from "@/api/services/authService";

const VerificationCode: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState("");
  const [userPhone, setUserPhone] = useState("");

  // Get userId from sessionStorage
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedPhone = sessionStorage.getItem("userPhone");
    
    if (!storedUserId) {
      // Redirect to signup if no userId found
      navigate("/auth/signup");
      return;
    }
    
    setUserId(storedUserId);
    setUserPhone(storedPhone || "XXX-XXX-XXXX");
  }, [navigate]);

  const handleVerify = async () => {
    if (code.length < 6) {
      setError("Please enter the complete OTP code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.verifyUser({
        userId,
        otp: code,
      });

      setSuccess("Verification successful! Redirecting...");
      
      // Clear session storage
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("userPhone");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    
    // In a real application, you would call an API to resend the OTP
    // For now, we'll just show a success message
    setSuccess("Code resent successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <AuthModalLayout title="Identify Verification">
      <div className="space-y-5 text-center">
        <LogoBadge size="md" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[#2F1C4E]">
            Text Confirmation
          </h3>
          <p className="text-sm text-[#6F5D9E]">
            A code was sent to {userPhone}
          </p>
        </div>
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            {success}
          </div>
        )}
        <OtpInput onChange={setCode} />
        <div className="flex flex-col">
          <Button
            type="button"
            className="text-sm font-semibold mb-5 !text-primary underline-offset-4 hover:underline"
            onClick={handleResendCode}
          >
            Resend code
          </Button>
          <Button
            variant="secondary"
            size="large"
            className="mx-auto w-full max-w-sm rounded-full bg-primary text-white hover:bg-[#4A1F6B]"
            onClick={handleVerify}
            disabled={code.length < 6 || loading}
          >
            <span className="font-semibold">{loading ? "Verifying..." : "Verify"}</span>
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
