import React from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import LogoBadge from "@/components/auth/LogoBadge";
import { Button } from "@/components/common";
import { useLanguage } from "@/i18n/LanguageContext";

const CreateAccountWelcome: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <AuthModalLayout title={t("auth.createAccount")}>
      <div className="space-y-6 text-center">
        <LogoBadge size="md" />
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-[#2E1B4D]">
            {t("auth.welcomeSingerlia")}
          </h3>
          <p className="text-sm text-secondary-text">
            {t("auth.welcomeCopy")}
          </p>
        </div>
        <Button
          variant="secondary"
          size="large"
          className="mx-auto w-full max-w-sm rounded-full bg-primary text-white hover:bg-[#4A1F6B]"
          onClick={() => navigate("/auth/choose-role")}
        >
          <span className="font-semibold">{t("auth.continue")}</span>
        </Button>
      </div>
    </AuthModalLayout>
  );
};

export default CreateAccountWelcome;
