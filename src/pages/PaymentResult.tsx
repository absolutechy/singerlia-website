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
  const [errorDetails, setErrorDetails] = useState<any>(null);

  // Extract bookingId and all query params from HyperPay redirect
  const searchParams = new URLSearchParams(location.search);
  const bookingId = searchParams.get("bookingId");
  const resourcePath = searchParams.get("resourcePath");
  const id = searchParams.get("id");
  
  // Log all HyperPay redirect parameters for debugging
  console.log("[PaymentResult] HyperPay redirect params:", {
    bookingId,
    resourcePath,
    id,
    fullURL: location.search,
    hyperPayURL: import.meta.env.VITE_HYPERPAY_URL,
    apiURL: import.meta.env.VITE_API_BASE_URL
  });

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
        console.log("[PaymentResult] Using resourcePath:", resourcePath || "Not provided");
        
        // Pass resourcePath to backend if available (critical for HyperPay verification)
        const result = await paymentService.getPaymentStatus(bookingId, resourcePath || undefined);
        console.log("[PaymentResult] Payment status result:", result);

        // If payment is pre-authorized, capture it automatically
        if (result.paymentStatus === "pre_authorized") {
          console.log("[PaymentResult] Payment pre-authorized, capturing payment...");
          
          try {
            const captureResult = await paymentService.capturePayment(bookingId);
            console.log("[PaymentResult] Capture result:", captureResult);
            
            if (captureResult.paymentStatus === "paid") {
              console.log("[PaymentResult] Payment captured successfully");
              setStatus("success");
              // Short delay so the user sees the success state before redirect
              setTimeout(() => {
                navigate("/booking/success", {
                  state: { bookingId, totalAmount: captureResult.capturedAmount },
                  replace: true,
                });
              }, 1500);
            } else {
              // Capture failed
              setStatus("failed");
              setErrorMessage(
                captureResult.resultDescription ||
                  "Payment capture failed. Please contact support."
              );
              setErrorDetails(captureResult);
            }
          } catch (captureErr: any) {
            console.error("[PaymentResult] Payment capture error:", captureErr);
            const captureErrorData = captureErr?.response?.data;
            setStatus("failed");
            setErrorDetails(captureErrorData);
            setErrorMessage(
              captureErrorData?.message || 
              captureErrorData?.resultDescription ||
              "Failed to capture payment. Please contact support."
            );
          }
        } else if (result.paymentStatus === "paid") {
          // Payment already captured/paid
          console.log("[PaymentResult] Payment already captured");
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
        console.error("[PaymentResult] Error response:", err?.response?.data);
        
        const errorData = err?.response?.data;
        setStatus("failed");
        setErrorDetails(errorData);
        
        // Provide specific error messages based on error codes
        let message = "Unable to verify payment status. Please contact support if you were charged.";
        
        if (errorData?.resultCode === "800.100.156") {
          message = "Payment declined due to a format error.\n\n" +
            "This usually means:\n" +
            "• The card doesn't support Pre-Authorization (PA) transactions\n" +
            "• Backend entity ID not configured for PA with HyperPay\n" +
            "• Try using VISA test card: 4200000000000000\n" +
            "• Or Mastercard test card: 5453010000059780\n\n" +
            "If using correct test cards and still failing, contact HyperPay support to enable PA on entity ID.";
        } else if (errorData?.resultCode === "200.300.404") {
          message = "Payment session not found. This could be due to:\n" +
            "• Environment mismatch between frontend and backend\n" +
            "• Payment session expired (>30 minutes)\n" +
            "• Backend configuration issue\n" +
            "\nPlease contact support with Booking ID: " + bookingId;
        } else if (errorData?.resultCode === "100.390.111") {
          message = "3D Secure authentication error. This usually indicates a backend configuration issue.\n" +
            "Please contact support with Booking ID: " + bookingId;
        } else if (errorData?.resultDescription) {
          message = errorData.resultDescription;
        } else if (errorData?.message) {
          message = errorData.message;
        } else if (err?.message) {
          message = err.message;
        }
        
        setErrorMessage(message);
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
                Please wait while we confirm and process your payment...
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
              <p className="text-[#6F5D9E] mb-6 whitespace-pre-line">{errorMessage}</p>
              
              {/* Debug information - only in development */}
              {import.meta.env.DEV && errorDetails && (
                <details className="text-left bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <summary className="cursor-pointer text-sm font-semibold text-red-800 mb-2">
                    🔍 Debug Information (Dev Only)
                  </summary>
                  <div className="text-xs font-mono text-red-700 space-y-2">
                    <div>
                      <strong>Error Code:</strong> {errorDetails.resultCode || 'N/A'}
                    </div>
                    <div>
                      <strong>Description:</strong> {errorDetails.resultDescription || 'N/A'}
                    </div>
                    <div>
                      <strong>Booking ID:</strong> {errorDetails.bookingId || bookingId}
                    </div>
                    <div>
                      <strong>Resource Path:</strong> {resourcePath || '❌ MISSING'}
                    </div>
                    <div>
                      <strong>Frontend HyperPay URL:</strong> {import.meta.env.VITE_HYPERPAY_URL}
                    </div>
                    <div>
                      <strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL}
                    </div>
                    {!resourcePath && (
                      <div className="p-2 bg-yellow-100 border border-yellow-300 rounded">
                        <strong>⚠️ Warning:</strong> resourcePath is missing from HyperPay redirect. 
                        This usually means the payment form redirect is not configured correctly.
                      </div>
                    )}
                    <div className="mt-3 p-2 bg-red-100 rounded">
                      <strong>Likely Cause:</strong>
                      <ul className="list-disc pl-5 mt-1">
                        {errorDetails.resultCode === '800.100.156' && (
                          <>
                            <li><strong>Format Error during PA transaction</strong></li>
                            <li>Card doesn't support Pre-Authorization (PA)</li>
                            <li>Entity ID not configured for PA with HyperPay</li>
                            <li>Missing or incorrect recurringType parameter</li>
                            <li><strong>Solution:</strong> Use VISA (4200000000000000) or Mastercard (5453010000059780) test cards</li>
                            <li><strong>Backend:</strong> Verify entity ID supports PA with HyperPay support</li>
                          </>
                        )}
                        {errorDetails.resultCode === '200.300.404' && (
                          <>
                            <li>Backend using different HyperPay environment (test vs prod)</li>
                            <li>Backend not using resourcePath from HyperPay redirect</li>
                            <li>Backend credentials don't match environment</li>
                          </>
                        )}
                        {errorDetails.resultCode === '100.390.111' && (
                          <>
                            <li>Backend 3D Secure configuration issue</li>
                            <li>Backend contacting wrong 3DS server</li>
                            <li>Backend using wrong HyperPay environment</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </details>
              )}
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
