import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import { dispatchAuthEvent } from "@/api/services/authService";
import { Clock, Mail } from "lucide-react";

const VerificationPending: React.FC = () => {
  const navigate = useNavigate();

  // Ensure singer is NOT logged in when reaching this page
  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.clear();
    
    // Dispatch auth event to update header and other components
    dispatchAuthEvent();
    
    console.log("Singer logged out - awaiting document approval");
  }, []);


  return (
    <AuthModalLayout
      title="Verification Pending"
      size="lg"
      onClose={() => navigate("/")}
    >
      <div className="flex flex-col items-center space-y-6 px-6 pt-10 sm:pt-0 text-center">
        {/* Logo */}
        {/* <LogoBadge size="lg" /> */}

        {/* Success Icon */}

        {/* Success Message */}
        <div className="space-y-3">
          <h3 className="text-2xl md:text-3xl font-bold text-primary-text font-chocolates">
            Your profile has been successfully uploaded!
          </h3>
          <p className="text-base text-[#6F5D9E] max-w-md mx-auto">
            Someone from the SingerLia team will verify your information and publish your profile.
          </p>
        </div>

        {/* Awaiting Section */}
        <div className="w-full max-w-md bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-100 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-5 h-5 text-red-500" />
            <h4 className="text-lg font-bold text-red-600">Awaiting</h4>
          </div>
          <p className="text-sm text-red-700 leading-relaxed">
            Singer profiles are only available to customers once they have been verified by the SingerLia admin. 
            This ensures quality and authenticity for all users on the platform.
          </p>
        </div>

        {/* Timeline Info */}
        <div className="bg-[#F7F4FF] border border-[#E5DAFF] rounded-xl p-4 w-full max-w-md">
          <p className="text-sm text-[#6F5D9E]">
            <span className="font-semibold text-primary">Verification typically takes 24-48 hours.</span>{" "}
            We'll notify you once your profile is live!
          </p>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-4">
          <Button
            variant="secondary"
            size="large"
            className="flex-1 rounded-full bg-primary text-white hover:bg-[#4A1F6B] flex items-center justify-center space-x-2"
            onClick={handleReturnToDashboard}
          >
            <span className="font-semibold">Return to Dashboard</span>
          </Button>
          <Button
            variant="secondary"
            size="large"
            className="flex-1 rounded-full !bg-[#F4B942] text-white hover:!bg-[#E5A832] flex items-center justify-center space-x-2"
            onClick={handleContactSupport}
          >
            <span className="font-semibold">Contact Support</span>
          </Button>
        </div> */}

        {/* Contact Info */}
        <div className="pt-4 border-t border-[#E5DAFF] w-full max-w-md">
          <p className="text-xs text-[#6F5D9E]">
            If you have any questions or concerns, please contact our customer service team.
          </p>
          <a
            href="mailto:support@singerlia.com"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-primary hover:underline mt-2"
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
