import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import LogoBadge from "@/components/auth/LogoBadge";
import { Button } from "@/components/common";
import { Mail, Phone } from "lucide-react";
import authService from "@/api/services/authService";

type VerificationType = "email" | "phone";

const options = [
  {
    id: "email" as VerificationType,
    title: "Email",
    description: "Select Email Verification",
    icon: <Mail className="h-6 w-6" />,
  },
  {
    id: "phone" as VerificationType,
    title: "Phone",
    description: "Select Phone Call Verification",
    icon: <Phone className="h-6 w-6" />,
  },
];

const SelectVerification: React.FC = () => {
  const [selected, setSelected] = useState<VerificationType>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  // Get userId from sessionStorage
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    
    if (!storedUserId) {
      // Redirect to signup if no userId found
      navigate("/auth/signup");
      return;
    }
    
    setUserId(storedUserId);
  }, [navigate]);

  const handleContinue = async () => {
    if (!userId) {
      setError("User ID not found. Please sign up again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.sendOtp({
        userId,
        fromphonenumber: selected === "phone",
      });

      console.log("OTP sent:", response);

      // Store verification method in sessionStorage
      sessionStorage.setItem("verificationType", selected);
      
      // Navigate to verification code page
      navigate("/auth/verification-code");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModalLayout title="Select Verification">
      <div className="space-y-8">
        <LogoBadge size="md" />
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <div className="space-y-4">
          {options.map((option) => {
            const isSelected = option.id === selected;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelected(option.id)}
                className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
                  isSelected
                    ? "border-primary bg-[#F8F4FF] shadow-[0_16px_34px_-24px_rgba(55,21,82,0.45)]"
                    : "border-[#E8DEFF] bg-white hover:border-[#CBB9FF]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-[#F4EEFF] text-primary"
                    }`}
                  >
                    {option.icon}
                  </span>
                  <div>
                    <p className="text-base font-semibold text-[#2F1C4E]">
                      {option.title}
                    </p>
                    <p className="text-sm text-[#6F5D9E]">{option.description}</p>
                  </div>
                </div>
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-[#D8CCFF]"
                  }`}
                >
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
              </button>
            );
          })}
        </div>
        <Button
          variant="secondary"
          size="large"
          className="mx-auto w-full max-w-sm rounded-full bg-primary text-white hover:bg-[#4A1F6B]"
          onClick={handleContinue}
          disabled={loading}
        >
          <span className="font-semibold">{loading ? "Sending..." : "Continue"}</span>
        </Button>
      </div>
    </AuthModalLayout>
  );
};

export default SelectVerification;
