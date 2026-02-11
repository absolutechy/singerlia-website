import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import Button from "@/components/common/Button";
import paymentService from "@/api/services/paymentService";

type VerificationState = "loading" | "success" | "failed";

const PaymentResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<VerificationState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Extract bookingId from query params
  const searchParams = new URLSearchParams(location.search);
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    if (!bookingId) {
      console.log("[PaymentResult] No bookingId found, redirecting to home");
      navigate("/", { replace: true });
      return;
    }

    console.log("[PaymentResult] Verifying payment for bookingId:", bookingId);

    const verifyPayment = async () => {
      try {
        console.log("[PaymentResult] Calling getPaymentStatus...");
        const result = await paymentService.getPaymentStatus(bookingId);
        console.log("[PaymentResult] Payment status result:", result);

        if (result.paymentStatus === "paid") {
          setStatus("success");
          // Short delay so the user sees the success state before redirect
          setTimeout(() => {
            navigate("/booking/success", {
              state: { bookingId, totalAmount: result.amount },
              replace: true,
            });
          }, 1500);
        } else if (result.paymentStatus === "pending" || result.paymentStatus === "checkout_prepared") {
          setStatus("failed");
          setErrorMessage(
            "Payment is still being processed. Please wait a moment and check your booking status."
          );
        } else {
          setStatus("failed");
          setErrorMessage(
            result.resultDescription ||
              "Payment was not completed. Please try again."
          );
        }
      } catch (err: any) {
        console.error("[PaymentResult] Payment verification error:", err);
        setStatus("failed");
        setErrorMessage(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to verify payment status. Please contact support if you were charged."
        );
      }
    };

    verifyPayment();
  }, [bookingId, navigate]);

  return (
    <div className="custom-container min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        {/* Loading State */}
        {status === "loading" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            </div>
            <div>
              <h1 className="heading-3 text-[#2E1B4D] mb-2">
                Verifying Your Payment
              </h1>
              <p className="text-[#6F5D9E]">
                Please wait while we confirm your payment...
              </p>
            </div>
          </div>
        )}

        {/* Success State (briefly shown before redirect) */}
        {status === "success" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <div>
              <h1 className="heading-3 text-[#2E1B4D] mb-2">
                Payment Verified!
              </h1>
              <p className="text-[#6F5D9E]">
                Redirecting you to your booking confirmation...
              </p>
            </div>
          </div>
        )}

        {/* Failed State */}
        {status === "failed" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
            </div>
            <div>
              <h1 className="heading-3 text-[#2E1B4D] mb-2">
                Payment Failed
              </h1>
              <p className="text-[#6F5D9E] mb-6">{errorMessage}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                size="large"
                className="w-full !h-14"
                onClick={() => {
                  // Navigate back — the booking page still has the booking, user can retry
                  navigate(-1);
                }}
              >
                Try Again
              </Button>
              <Button
                variant="default"
                size="large"
                className="w-full !h-14"
                onClick={() => navigate("/")}
              >
                Return Home
              </Button>
            </div>

            <p className="text-sm text-[#6F5D9E] mt-4">
              Need help?{" "}
              <a
                href="mailto:support@singerlia.com"
                className="text-primary hover:underline font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
