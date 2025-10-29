import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import { Button, Input } from "@/components/common";
import authService from "@/api/services/authService";
import { toast } from "sonner";

interface LocationState {
  userId: string;
  phoneNumber: string;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [formData, setFormData] = useState({
    resetPasswordCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Redirect if no state
  useEffect(() => {
    if (!state?.userId || !state?.phoneNumber) {
      navigate("/auth/forgot-password");
    }
  }, [state, navigate]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setLoading(true);
    setError("");

    try {
      const response = await authService.sendResetPasswordCode({
        phonenumber: state.phoneNumber,
      });

      console.log("Reset code resent", response);

      // Restart timer
      setTimer(60);
      setCanResend(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to resend code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    // Validation
    if (!formData.resetPasswordCode || !formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.resetForgottenPassword({
        userId: state.userId,
        resetPasswordCode: formData.resetPasswordCode,
        newPassword: formData.newPassword,
      });

      console.log("Password reset successful:", response.message);
      
      // Show success message and navigate to login
      toast.success("Password reset successful! Please login with your new password.");
      navigate("/auth/login");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please check your code and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!state?.userId) {
    return null;
  }

  return (
    <AuthModalLayout title="Reset Password" size="md">
      <div className="flex flex-col items-center gap-8">
        <div className="w-full space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-black">
              Enter Verification Code
            </h3>
            <p className="text-sm text-gray-600">
              We've sent a verification code to {state.phoneNumber}
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <Input
              id="resetPasswordCode"
              type="text"
              placeholder="Verification Code"
              className="bg-[#F7FBFF] border border-[#D4D7E3] !pl-2 !py-6"
              value={formData.resetPasswordCode}
              onChange={handleInputChange}
              maxLength={6}
            />
            <Input
              id="newPassword"
              type="password"
              placeholder="New Password"
              className="bg-[#F7FBFF] border border-[#D4D7E3] !pl-2 !py-6"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              className="bg-[#F7FBFF] border border-[#D4D7E3] !pl-2 !py-6"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>

          <Button
            variant="secondary"
            size="large"
            className="w-full rounded-full bg-primary text-white hover:bg-[#4A1F6B]"
            onClick={handleResetPassword}
            disabled={loading}
          >
            <span className="font-semibold">
              {loading ? "Resetting Password..." : "Reset Password"}
            </span>
          </Button>

          <div className="text-center space-y-2">
            {timer > 0 ? (
              <p className="text-sm text-gray-600">
                Didn't receive the code? Resend in {timer} seconds
              </p>
            ) : (
              <Button
                className="!text-primary btn-text !text-sm underline-offset-4 hover:underline"
                onClick={handleResendCode}
                disabled={loading}
              >
                Resend Verification Code
              </Button>
            )}
          </div>

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

export default ResetPassword;
