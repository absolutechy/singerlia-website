import React, { useState } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import SelectableCard from "@/components/auth/SelectableCard";
import { Button } from "@/components/common";
import { CreditCard, FileText } from "lucide-react";

const DocumentTypeSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<"national_id" | "passport" | null>(null);
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!selectedType) {
      setError("Please select a document type");
      return;
    }

    // Store selected document type and navigate to upload page
    sessionStorage.setItem("documentType", selectedType);
    navigate("/auth/upload-document");
  };

  return (
    <AuthModalLayout
      title="Verify Your Identity"
      size="md"
    >
      <div className="space-y-6 pt-12 sm:pt-5">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-primary-text">
            Select Document Type
          </p>
          <p className="text-sm text-[#6F5D9E]">
            Choose the type of identification document you want to upload
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 place-items-center px-4">
          <SelectableCard
            title="National ID Card"
            description="Upload your Saudi National ID"
            icon={<CreditCard className="w-8 h-8" />}
            selected={selectedType === "national_id"}
            onClick={() => {
              setSelectedType("national_id");
              setError("");
            }}
          />
          <SelectableCard
            title="Passport"
            description="Upload your valid passport"
            icon={<FileText className="w-8 h-8" />}
            selected={selectedType === "passport"}
            onClick={() => {
              setSelectedType("passport");
              setError("");
            }}
          />
        </div>

        <div className="px-4 pt-4">
          <Button
            variant="secondary"
            size="large"
            className="mx-auto w-full max-w-md rounded-full bg-primary text-white hover:bg-[#4A1F6B]"
            onClick={handleContinue}
          >
            <span className="font-semibold">Continue</span>
          </Button>
        </div>
      </div>
    </AuthModalLayout>
  );
};

export default DocumentTypeSelection;
