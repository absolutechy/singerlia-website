import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import { Button } from "@/components/common";
import { Upload, FileText, X } from "lucide-react";
import authService, { dispatchAuthEvent } from "@/api/services/authService";
import { isDocumentType } from "@/components/auth/identityDocuments";
import { useLanguage, type TranslationKey } from "@/i18n/LanguageContext";

const DocumentUpload: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);

  const documentType = sessionStorage.getItem("documentType");

  // Redirect if no document type selected (but not if we're navigating away)
  React.useEffect(() => {
    if (!documentType && !isNavigatingAway) {
      navigate("/auth/select-document-type");
    }
  }, [documentType, navigate, isNavigatingAway]);

  const documentName = isDocumentType(documentType)
    ? t(`docs.${documentType}` as TranslationKey)
    : t("docs.passport");

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setError(t("docs.invalidFile"));
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError(t("docs.tooLarge"));
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(t("docs.selectFile"));
      return;
    }

    if (!documentType) {
      setError(t("docs.typeMissing"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.uploadVerificationDocument(documentType, selectedFile);

      // Set flag to prevent useEffect redirect
      setIsNavigatingAway(true);

      // Clear session storage and ensure singer is logged out
      sessionStorage.clear();
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      // Small delay to ensure storage is cleared before dispatching event
      setTimeout(() => {
        // Dispatch auth event to update header and other components
        dispatchAuthEvent();

        // Navigate to verification pending screen
        navigate("/auth/verification-pending", { replace: true });
      }, 100);
    } catch (err: any) {
      setError(err.response?.data?.message || t("docs.uploadFailed"));
      setLoading(false);
    }
  };

  return (
    <AuthModalLayout title={t("docs.uploadTitle")} size="md">
      <div className="space-y-6 pt-40 sm:pt-0 px-4">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-primary-text">
            {t("docs.uploadYour", { document: documentName })}
          </p>
          <p className="text-sm text-[#6F5D9E]">
            {t("docs.uploadHelp", { document: documentName })}
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* File Upload Area */}
          {!selectedFile ? (
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-[#F7F4FF]"
                  : "border-[#D5CAFF] hover:border-primary hover:bg-[#FAFBFF]"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F7F4FF] flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary-text">{t("docs.dragDrop")}</p>
                  <p className="text-xs text-[#6F5D9E]">{t("docs.or")}</p>
                  <Button
                    variant="default"
                    size="medium"
                    className="rounded-full border-primary !text-primary hover:bg-[#F7F4FF] bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {t("docs.browse")}
                  </Button>
                </div>

                <p className="text-xs text-[#6F5D9E]">{t("docs.formats")}</p>
              </div>
            </div>
          ) : (
            // Selected File Preview
            <div className="border-2 border-[#D5CAFF] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#F7F4FF] flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary-text truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-[#6F5D9E]">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-2 rounded-full hover:bg-red-50 text-red-500 transition"
                  aria-label={t("docs.removeFile")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Information Box */}
          <div className="bg-[#F7F4FF] border border-[#E5DAFF] rounded-lg p-4 text-start">
            <p className="text-xs text-[#6F5D9E] leading-relaxed">
              <strong className="text-primary">{t("docs.important")}</strong> {t("docs.makeSure")}
            </p>
            <ul className="mt-2 text-xs text-[#6F5D9E] space-y-1 ms-4 list-disc">
              <li>{t("docs.rule.clear")}</li>
              <li>{t("docs.rule.notExpired")}</li>
              <li>{t("docs.rule.showsName")}</li>
              <li>{t("docs.rule.corners")}</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="default"
            size="medium"
            className="flex-1 rounded-full border-[#D5CAFF] !text-primary hover:bg-[#FAFBFF] bg-transparent"
            onClick={() => navigate("/auth/select-document-type")}
            disabled={loading}
          >
            <span className="font-semibold">{t("docs.back")}</span>
          </Button>
          <Button
            variant="secondary"
            size="medium"
            className="flex-1 rounded-full bg-primary text-white hover:bg-[#4A1F6B]"
            onClick={handleUpload}
            disabled={loading || !selectedFile}
          >
            <span className="font-semibold">
              {loading ? t("docs.uploading") : t("docs.upload")}
            </span>
          </Button>
        </div>
      </div>
    </AuthModalLayout>
  );
};

export default DocumentUpload;
