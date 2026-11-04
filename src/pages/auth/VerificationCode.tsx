import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import LogoBadge from "@/components/auth/LogoBadge";
import OtpInput from "@/components/auth/OtpInput";
import { Button, Input } from "@/components/common";
import authService from "@/api/services/authService";
import { useLanguage } from "@/i18n/LanguageContext";

const VerificationCode: React.FC = () => {
  const { t } = useLanguage();
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
      setError(t("verify.incomplete"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get user role to determine next step
      const userRole = sessionStorage.getItem("userRole");
      
      await authService.verifyUser({
        userId,
        otp: code,
      });

      setSuccess(t("verify.success"));
      
      // Clear some session storage but keep userId temporarily for document upload
      sessionStorage.removeItem("userPhone");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("verificationType");
      
      // If singer, redirect to document upload flow after 1 second
      // Keep them logged in temporarily for document upload
      // They will be logged out after successful document upload
      // If regular user, redirect to home
      setTimeout(() => {
        if (userRole === "singer") {
          sessionStorage.removeItem("userRole"); // Clear role after checking
          navigate("/auth/select-document-type");
        } else {
          sessionStorage.removeItem("userRole");
          navigate("/");
        }
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || t("verify.failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async (useNewContact: boolean = false) => {
    if (!canResend && !useNewContact) return;

    // Validate new contact if changing
    if (useNewContact) {
      if (!newContact.trim()) {
        setError(verificationType === "phone" ? t("verify.invalidPhone") : t("verify.invalidEmail"));
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
        setSuccess(t("verify.sentToNew", { contact: newContact.trim() }));
      } else {
        setSuccess(t("verify.resent"));
      }
      
      setTimer(60);
      setCanResend(false);
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || t("verify.resendFailed"));
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
  const contactType = verificationType === "phone" ? "tel" : "email";

  return (
    <AuthModalLayout title={t("verify.title")}>
      <div className="space-y-5 text-center">
        <LogoBadge size="md" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[#2F1C4E]">
            {verificationType === "phone" ? t("verify.textConfirmation") : t("verify.emailConfirmation")}
          </h3>
          {!isEditingContact ? (
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-[#6F5D9E]">
                {t("verify.codeSentTo", { contact: displayContact || (verificationType === "phone" ? t("verify.yourPhone") : t("verify.yourEmail")) })}
              </p>
              <button
                type="button"
                onClick={handleChangeContact}
                className="text-xs text-primary font-semibold hover:underline"
              >
                {t("verify.change")}
              </button>
            </div>
          ) : (
            <div className="space-y-3 px-4">
              <p className="text-sm text-[#6F5D9E]">{verificationType === "phone" ? t("verify.enterNewPhone") : t("verify.enterNewEmail")}</p>
              <Input
                id="newContact"
                type={contactType}
                placeholder={verificationType === "phone" ? t("verify.newPhone") : t("verify.newEmail")}
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
                  {t("verify.sendCode")}
                </Button>
                <Button
                  variant="default"
                  className="text-xs px-4 py-2 border border-primary !text-primary rounded-full hover:bg-gray-50"
                  onClick={handleCancelChangeContact}
                  disabled={loading}
                >
                  {t("verify.cancel")}
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
                  {t("verify.resendIn", { seconds: timer })}
                </p>
              ) : (
                <Button
                  type="button"
                  className="text-sm font-semibold mb-5 !text-primary underline-offset-4 hover:underline"
                  onClick={() => handleResendCode(false)}
                  disabled={loading || !canResend}
                >
                  {t("verify.resend")}
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
            <span className="font-semibold">{loading ? t("verify.verifying") : t("verify.verify")}</span>
          </Button>
        </div>
        <p className="text-sm text-[#6F5D9E]">
          {t("verify.problems")}{" "}
          <a
            href="#"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            {t("verify.contactUs")}
          </a>
        </p>
      </div>
    </AuthModalLayout>
  );
};

export default VerificationCode;
