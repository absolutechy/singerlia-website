import React, { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import { Button } from "@/components/common";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import authService from "@/api/services/authService";
import { toast } from "sonner";
import { isDocumentType } from "@/components/auth/identityDocuments";
import { useLanguage, type TranslationKey } from "@/i18n/LanguageContext";

const DocumentReupload: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [documentType, setDocumentType] = useState<string>("");

  const email = searchParams.get("email");

  // Redirect if no email provided
  React.useEffect(() => {
    if (!email) {
      toast.error(t("docs.emailRequired"));
      navigate("/auth/login");
      return;
    }

    // Get document type from session storage
    const storedDocType = sessionStorage.getItem("reuploadDocumentType");
    if (!storedDocType) {
      toast.error(t("docs.selectTypeFirst"));
      navigate(`/auth/reupload-document-type?email=${encodeURIComponent(email)}`);
      return;
    }
    setDocumentType(storedDocType);
  }, [email, navigate, t]);

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

    if (!email) {
      setError(t("docs.emailRequired"));
      return;
    }

    if (!documentType) {
      setError(t("docs.typeMissing"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.reuploadVerificationDocument(email, selectedFile, documentType);
      
      toast.success(response.message || t("docs.uploaded"));
      
      // Navigate to verification pending or success page
      setTimeout(() => {
        navigate("/auth/verification-pending", { replace: true });
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || t("docs.uploadFailed");
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <AuthModalLayout
      title={t("docs.reuploadTitle")}
      size="md"
    >
      <div className="space-y-6 pt-40 sm:pt-0 px-4">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-primary-text">
            {t("docs.reuploadYour", { document: documentName })}
          </p>
          <p className="text-sm text-[#6F5D9E]">
            {t("docs.uploadHelp", { document: documentName })}
          </p>
          {email && (
            <p className="text-xs text-[#6F5D9E] bg-[#F7F4FF] p-2 rounded-lg">
              {t("docs.uploadingFor")} <span className="font-semibold text-primary">{email}</span>
            </p>
          )}
        </div>

        {/* Information Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900">{t("docs.reuploadNotice")}</p>
            <p className="text-xs text-blue-700 mt-1">
              {t("docs.reuploadNoticeBody")}
            </p>
          </div>
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
                  <p className="text-sm font-semibold text-primary-text">
                    {t("docs.dragDrop")}
                  </p>
                  <p className="text-xs text-[#6F5D9E]">
                    {t("docs.or")}
                  </p>
                  <Button
                    variant="default"
                    size="medium"
                    className="rounded-full border-primary !text-primary hover:bg-[#F7F4FF] bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {t("docs.browse")}
                  </Button>
                </div>
                
                <p className="text-xs text-[#6F5D9E]">
                  {t("docs.formats")}
                </p>
              </div>
            </div>
          ) : (
            // Selected File Preview
            <div className="border-2 border-[#D5CAFF] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
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
          <div className="bg-[#F7F4FF] border border-[#E5DAFF] rounded-lg p-4">
            <p className="text-xs text-[#6F5D9E] leading-relaxed">
              <strong className="text-primary">{t("docs.important")}</strong> {t("docs.makeSure")}
            </p>
            <ul className="mt-2 text-xs text-[#6F5D9E] space-y-1 ml-4 list-disc">
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
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            <span className="font-semibold">{t("docs.cancel")}</span>
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

export default DocumentReupload;
