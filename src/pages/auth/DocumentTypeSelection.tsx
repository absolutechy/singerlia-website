import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import SelectableCard from "@/components/auth/SelectableCard";
import { Button } from "@/components/common";
import singerService from "@/api/services/singerService";
import {
  DOCUMENT_TYPES,
  REQUIRED_DOCUMENT,
  isIdentityCategory,
  type DocumentType,
  type IdentityCategory,
} from "@/components/auth/identityDocuments";
import { useLanguage, type TranslationKey } from "@/i18n/LanguageContext";

const DocumentTypeSelection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const storedCategory = sessionStorage.getItem("identityCategory");
  const [identityCategory, setIdentityCategory] = useState<IdentityCategory | null>(
    isIdentityCategory(storedCategory) ? storedCategory : null
  );
  const requiredDocument = identityCategory ? REQUIRED_DOCUMENT[identityCategory] : null;
  const [selectedType, setSelectedType] = useState<DocumentType | null>(requiredDocument);
  const [error, setError] = useState("");

  // Singers who registered earlier (or opened this page in a new tab) have no category in session
  // storage; their account still knows it.
  useEffect(() => {
    if (identityCategory) return;
    singerService
      .getMyProfileStatus()
      .then(({ identityCategory: category }) => {
        if (isIdentityCategory(category)) {
          setIdentityCategory(category);
          setSelectedType(REQUIRED_DOCUMENT[category]);
        }
      })
      .catch(() => {
        // Unknown category: every document type stays available.
      });
  }, [identityCategory]);

  // Each kind of singer needs exactly one document, so only that one is offered when known.
  const options = requiredDocument
    ? DOCUMENT_TYPES.filter((doc) => doc.type === requiredDocument)
    : DOCUMENT_TYPES;

  const handleContinue = () => {
    if (!selectedType) {
      setError(t("docs.selectError"));
      return;
    }

    sessionStorage.setItem("documentType", selectedType);
    navigate("/auth/upload-document");
  };

  return (
    <AuthModalLayout title={t("docs.verifyTitle")} size="md">
      <div className="space-y-6 pt-12 sm:pt-5">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-primary-text">{t("docs.selectType")}</p>
          <p className="text-sm text-[#6F5D9E]">
            {requiredDocument
              ? t("docs.requiredHelp", { document: t(`docs.${requiredDocument}` as TranslationKey) })
              : t("docs.selectTypeHelp")}
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 text-center">{error}</div>
        )}

        <div
          className={`grid gap-4 place-items-center px-4 ${
            options.length === 1 ? "" : options.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
          }`}
        >
          {options.map(({ type, icon: Icon }) => (
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

export default DocumentTypeSelection;
