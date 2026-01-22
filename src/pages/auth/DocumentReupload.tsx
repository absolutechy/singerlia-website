import React, { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import { Button } from "@/components/common";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import authService from "@/api/services/authService";
import { toast } from "sonner";

const DocumentReupload: React.FC = () => {
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
      toast.error("Email is required for document reupload");
      navigate("/auth/login");
      return;
    }

    // Get document type from session storage
    const storedDocType = sessionStorage.getItem("reuploadDocumentType");
    if (!storedDocType) {
      toast.error("Please select a document type first");
      navigate(`/auth/reupload-document-type?email=${encodeURIComponent(email)}`);
      return;
    }
    setDocumentType(storedDocType);
  }, [email, navigate]);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid file (JPG, PNG, or PDF)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
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
      setError("Please select a file to upload");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!documentType) {
      setError("Document type is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.reuploadVerificationDocument(email, selectedFile, documentType);
      
      toast.success(response.message || "Document uploaded successfully");
      
      // Navigate to verification pending or success page
      setTimeout(() => {
        navigate("/auth/verification-pending", { replace: true });
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Upload failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <AuthModalLayout
      title="Reupload Document"
      size="md"
    >
      <div className="space-y-6 pt-40 sm:pt-0 px-4">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-primary-text">
            Reupload Your {documentType === "national_id" ? "National ID" : "Passport"}
          </p>
          <p className="text-sm text-[#6F5D9E]">
            Please upload a clear photo or scan of your {documentType === "national_id" ? "National ID card" : "passport"}
          </p>
          {email && (
            <p className="text-xs text-[#6F5D9E] bg-[#F7F4FF] p-2 rounded-lg">
              Uploading for: <span className="font-semibold text-primary">{email}</span>
            </p>
          )}
        </div>

        {/* Information Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Document Reupload Required</p>
            <p className="text-xs text-blue-700 mt-1">
              Your previous document submission needs to be replaced. Please upload a new, clear document that meets all requirements.
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
                    Drag and drop your file here
                  </p>
                  <p className="text-xs text-[#6F5D9E]">
                    or
                  </p>
                  <Button
                    variant="default"
                    size="medium"
                    className="rounded-full border-primary !text-primary hover:bg-[#F7F4FF] bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </Button>
                </div>
                
                <p className="text-xs text-[#6F5D9E]">
                  Supported formats: JPG, PNG, PDF (Max 5MB)
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
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Information Box */}
          <div className="bg-[#F7F4FF] border border-[#E5DAFF] rounded-lg p-4">
            <p className="text-xs text-[#6F5D9E] leading-relaxed">
              <strong className="text-primary">Important:</strong> Make sure your document is:
            </p>
            <ul className="mt-2 text-xs text-[#6F5D9E] space-y-1 ml-4 list-disc">
              <li>Clear and readable with no blur or glare</li>
              <li>Not expired</li>
              <li>Shows your full name and photo clearly</li>
              <li>All corners of the document are visible</li>
              <li>Taken in good lighting conditions</li>
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
            <span className="font-semibold">Cancel</span>
          </Button>
          <Button
            variant="secondary"
            size="medium"
            className="flex-1 rounded-full bg-primary text-white hover:bg-[#4A1F6B]"
            onClick={handleUpload}
            disabled={loading || !selectedFile}
          >
            <span className="font-semibold">
              {loading ? "Uploading..." : "Upload Document"}
            </span>
          </Button>
        </div>
      </div>
    </AuthModalLayout>
  );
};

export default DocumentReupload;
