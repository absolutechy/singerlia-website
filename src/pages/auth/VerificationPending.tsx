import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import { Button } from "@/components/common";
import { dispatchAuthEvent } from "@/api/services/authService";
import { Clock, ListChecks, Mail } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const VerificationPending: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Ensure singer is NOT logged in when reaching this page
  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // Dispatch auth event to update header and other components
    dispatchAuthEvent();
  }, []);

  return (
    <AuthModalLayout title={t("pending.title")} size="lg" onClose={() => navigate("/")}>
      <div className="flex flex-col items-center space-y-6 px-6 pt-10 sm:pt-0 text-center">
        <div className="space-y-3">
          <h3 className="text-2xl md:text-3xl font-bold text-primary-text font-chocolates">
            {t("pending.heading")}
          </h3>
          <p className="text-base text-[#6F5D9E] max-w-md mx-auto">{t("pending.body")}</p>
        </div>

        <div className="w-full max-w-md bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-100 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-red-500" />
            <h4 className="text-lg font-bold text-red-600">{t("pending.awaiting")}</h4>
          </div>
          <p className="text-sm text-red-700 leading-relaxed">{t("pending.awaitingBody")}</p>
        </div>

        {/* Approval alone doesn't make a singer visible — pricing and payout details are still
            needed, so say so here rather than letting them wait for an approval that won't list them. */}
        <div className="w-full max-w-md rounded-xl border border-[#E5DAFF] bg-white p-4 text-start flex gap-3">
          <ListChecks className="w-5 h-5 shrink-0 text-primary mt-0.5" />
          <p className="text-sm text-[#2E1B4D] leading-relaxed">{t("pending.nextSteps")}</p>
        </div>

        <div className="bg-[#F7F4FF] border border-[#E5DAFF] rounded-xl p-4 w-full max-w-md">
          <p className="text-sm text-[#6F5D9E]">
            <span className="font-semibold text-primary">{t("pending.timeline")}</span>{" "}
            {t("pending.notify")}
          </p>
        </div>

        <Button
          variant="secondary"
          size="large"
          className="w-full max-w-md rounded-full bg-primary text-white hover:bg-[#4A1F6B]"
          onClick={() => {
            window.location.href = `${import.meta.env.VITE_PORTAL_URL}/auth/login`;
          }}
        >
          <span className="font-semibold">{t("pending.goToPortal")}</span>
        </Button>

        <div className="pt-4 border-t border-[#E5DAFF] w-full max-w-md">
          <p className="text-xs text-[#6F5D9E]">{t("pending.questions")}</p>
          <a
            href="mailto:support@singerlia.com"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mt-2"
          >
            <Mail className="w-4 h-4" />
            <span>support@singerlia.com</span>
          </a>
        </div>
      </div>
    </AuthModalLayout>
  );
};

export default VerificationPending;
