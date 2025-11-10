import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import LogoBadge from "@/components/auth/LogoBadge";
import OtpInput from "@/components/auth/OtpInput";
import { Button, Input } from "@/components/common";
import authService from "@/api/services/authService";

const VerificationCode: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [verificationType, setVerificationType] = useState<"phone" | "email">("phone");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [newContact, setNewContact] = useState("");

  // Get userId and verification type from sessionStorage
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedPhone = sessionStorage.getItem("userPhone");
    const storedEmail = sessionStorage.getItem("userEmail");
    const storedVerificationType = sessionStorage.getItem("verificationType") as "phone" | "email" | null;
    
    if (!storedUserId) {
      // Redirect to signup if no userId found
      navigate("/auth/signup");
      return;
    }
    
    setUserId(storedUserId);
    setUserPhone(storedPhone || "");
    setUserEmail(storedEmail || "");
    setVerificationType(storedVerificationType || "phone");
  }, [navigate]);

  // Timer countdown
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
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("verificationType");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed. Please check your code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async (useNewContact: boolean = false) => {
    if (!canResend && !useNewContact) return;

    // Validate new contact if changing
    if (useNewContact) {
      if (!newContact.trim()) {
        setError(`Please enter a valid ${verificationType === "phone" ? "phone number" : "email address"}`);
        return;
      }
    }

    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      const requestData: any = {
        userId,
        fromphonenumber: verificationType === "phone",
      };

      // Add new contact if user is changing it
      if (useNewContact && newContact.trim()) {
        if (verificationType === "phone") {
          requestData.newphonenumber = newContact.trim();
        } else {
          requestData.newemail = newContact.trim();
        }
      }

      const response = await authService.resendOtp(requestData);

      console.log("OTP resent:", response);
      
      // Update the displayed contact if changed
      if (useNewContact && newContact.trim()) {
        if (verificationType === "phone") {
          setUserPhone(newContact.trim());
          sessionStorage.setItem("userPhone", newContact.trim());
        } else {
          setUserEmail(newContact.trim());
          sessionStorage.setItem("userEmail", newContact.trim());
        }
        setIsEditingContact(false);
        setNewContact("");
        setSuccess(`Verification code sent to ${newContact.trim()}!`);
      } else {
        setSuccess("Verification code resent successfully!");
      }
      
      setTimer(60);
      setCanResend(false);
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeContact = () => {
    setIsEditingContact(true);
    setNewContact("");
    setError("");
    setSuccess("");
  };

  const handleCancelChangeContact = () => {
    setIsEditingContact(false);
    setNewContact("");
    setError("");
  };

  const displayContact = verificationType === "phone" ? userPhone : userEmail;
  const contactLabel = verificationType === "phone" ? "Phone Number" : "Email";
  const contactType = verificationType === "phone" ? "tel" : "email";

  return (
    <AuthModalLayout title="Identify Verification">
      <div className="space-y-5 text-center">
        <LogoBadge size="md" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[#2F1C4E]">
            {verificationType === "phone" ? "Text Confirmation" : "Email Confirmation"}
          </h3>
          {!isEditingContact ? (
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-[#6F5D9E]">
                A code was sent to {displayContact || "your " + contactLabel.toLowerCase()}
              </p>
              <button
                type="button"
                onClick={handleChangeContact}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="space-y-3 px-4">
              <p className="text-sm text-[#6F5D9E]">Enter new {contactLabel.toLowerCase()}</p>
              <Input
                id="newContact"
                type={contactType}
                placeholder={`New ${contactLabel}`}
                className="bg-[#F7FBFF] border border-[#D4D7E3] !pl-2 !py-3 text-sm"
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
              />
              <div className="flex gap-2 justify-center">
                <Button
                  variant="secondary"
                  className="rounded-full hover:bg-[#4A1F6B]"
                  onClick={() => handleResendCode(true)}
                  disabled={loading || !newContact.trim()}
                >
                  Send Code
                </Button>
                <Button
                  variant="default"
                  className="text-xs px-4 py-2 border border-primary !text-primary rounded-full hover:bg-gray-50"
                  onClick={handleCancelChangeContact}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
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
          {!isEditingContact && (
            <>
              {timer > 0 ? (
                <p className="text-sm text-[#6F5D9E] mb-5">
                  Resend code in {timer} seconds
                </p>
              ) : (
                <Button
                  type="button"
                  className="text-sm font-semibold mb-5 !text-primary underline-offset-4 hover:underline"
                  onClick={() => handleResendCode(false)}
                  disabled={loading || !canResend}
                >
                  Resend code
                </Button>
              )}
            </>
          )}
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
