import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import SelectableCard from "@/components/auth/SelectableCard";
import { Button } from "@/components/common";
import { toast } from "sonner";
import { DOCUMENT_TYPES, type DocumentType } from "@/components/auth/identityDocuments";
import { useLanguage, type TranslationKey } from "@/i18n/LanguageContext";

const DocumentReuploadTypeSelection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [error, setError] = useState("");

  const email = searchParams.get("email");

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      toast.error(t("docs.emailRequired"));
      navigate("/auth/login");
    }
  }, [email, navigate, t]);

  const handleContinue = () => {
    if (!selectedType) {
      setError(t("docs.selectError"));
      return;
    }

    if (!email) {
      setError(t("docs.emailRequired"));
      return;
    }

    // Store selected document type and navigate to reupload page with email
    sessionStorage.setItem("reuploadDocumentType", selectedType);
    navigate(`/singer/reupload-verification?email=${encodeURIComponent(email)}`);
  };

  return (
    <AuthModalLayout title={t("docs.verifyTitle")} size="md">
      <div className="space-y-6 pt-12 sm:pt-5">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-primary-text">{t("docs.reuploadSelectType")}</p>
          <p className="text-sm text-[#6F5D9E]">{t("docs.reuploadSelectHelp")}</p>
          {email && (
            <p className="text-xs text-[#6F5D9E] bg-[#F7F4FF] p-2 rounded-lg mt-2">
              {t("docs.uploadingFor")} <span className="font-semibold text-primary">{email}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 text-center">{error}</div>
        )}

        {/* This link is opened signed out, so the singer's category isn't known here — all three
            documents are offered and the backend rejects one that doesn't match their account. */}
        <div className="grid gap-4 md:grid-cols-3 place-items-center px-4">
          {DOCUMENT_TYPES.map(({ type, icon: Icon }) => (
            <SelectableCard
              key={type}
              title={t(`docs.${type}` as TranslationKey)}
              description={t(`docs.${type}.help` as TranslationKey)}
              icon={<Icon className="w-8 h-8" />}
              selected={selectedType === type}
              onClick={() => {
                setSelectedType(type);
                setError("");
              }}
            />
          ))}
        </div>

        <div className="px-4 pt-4">
          <Button
            variant="secondary"
            size="large"
            className="mx-auto w-full max-w-md rounded-full bg-primary text-white hover:bg-[#4A1F6B]"
            onClick={handleContinue}
          >
            <span className="font-semibold">{t("verify.continue")}</span>
          </Button>
        </div>
      </div>
    </AuthModalLayout>
  );
};

export default DocumentReuploadTypeSelection;
