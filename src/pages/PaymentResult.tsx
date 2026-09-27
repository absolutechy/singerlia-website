import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import Button from "@/components/common/Button";
import paymentService from "@/api/services/paymentService";
import { useLanguage } from "@/i18n/LanguageContext";

type VerificationState = "loading" | "success" | "pending_capture" | "failed";

const PaymentResult: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<VerificationState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<any>(null);

  const searchParams = new URLSearchParams(location.search);
  const bookingId = searchParams.get("bookingId");
  const resourcePath = searchParams.get("resourcePath");
  const id = searchParams.get("id");
  const storedResourcePathKey = bookingId
    ? `hyperpay_resource_path_${bookingId}`
    : null;
  const resolvedResourcePath =
    resourcePath ||
    (storedResourcePathKey
      ? sessionStorage.getItem(storedResourcePathKey) ||
        localStorage.getItem(storedResourcePathKey)
      : null);

  console.log("[PaymentResult] HyperPay redirect params:", {
    bookingId,
    resourcePath: resolvedResourcePath,
    id,
    fullURL: location.search,
    hyperPayURL: import.meta.env.VITE_HYPERPAY_URL,
    apiURL: import.meta.env.VITE_API_BASE_URL,
  });

  useEffect(() => {
    if (!bookingId) {
      navigate("/", { replace: true });
      return;
    }

    if (resourcePath && storedResourcePathKey) {
      sessionStorage.setItem(storedResourcePathKey, resourcePath);
      localStorage.setItem(storedResourcePathKey, resourcePath);
    }

    let cancelled = false;
    let retryCount = 0;
    const maxClientRetries = 4;

    const verifyPayment = async () => {
      try {
        const result = await paymentService.getPaymentStatus(
          bookingId,
          resolvedResourcePath || undefined
        );

        if (cancelled) return;

        if (result.retryable) {
          retryCount += 1;
          if (retryCount > maxClientRetries) {
            setStatus("failed");
            setErrorMessage(t("payment.stillProcessing"));
            return;
          }

          window.setTimeout(() => {
            if (!cancelled) {
              void verifyPayment();
            }
          }, result.retryAfterMs || 3000);
          return;
        }

        if (result.paymentStatus === "paid" || result.paymentStatus === "captured") {
          setStatus("success");
          window.setTimeout(() => {
            navigate("/booking/success", {
              state: { bookingId, totalAmount: result.amount },
              replace: true,
            });
          }, 1500);
          return;
        }

        if (result.paymentStatus === "pre_authorized" && result.requiresCapture) {
          setStatus("pending_capture");
          setErrorMessage(
            result.message ||
              t("payment.capturePendingRetry")
          );
          return;
        }

        setStatus("failed");
        setErrorMessage(
          result.resultDescription ||
            result.message ||
            t("payment.wasNotCompleted")
        );
      } catch (err: any) {
        if (cancelled) return;

        const errorData = err?.response?.data;
        setStatus("failed");
        setErrorDetails(errorData);

        let message = t("payment.verifyUnable");

        if (errorData?.resultCode === "800.100.152") {
          message = t("payment.transactionDeclined");
        } else if (errorData?.resultCode === "200.300.404") {
          message = t("payment.sessionNotFound");
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

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [bookingId, navigate, resolvedResourcePath, resourcePath, storedResourcePathKey]);

  return (
    <div className="custom-container min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            </div>
            <div>
              <h1 className="heading-3 text-[#2E1B4D] mb-2">
                {t("payment.verifying")}
              </h1>
              <p className="text-[#6F5D9E]">
                {t("payment.verifyingText")}
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <div>
              <h1 className="heading-3 text-[#2E1B4D] mb-2">
                {t("payment.verified")}
              </h1>
              <p className="text-[#6F5D9E]">
                {t("payment.redirecting")}
              </p>
            </div>
          </div>
        )}

        {status === "pending_capture" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-amber-600" />
              </div>
            </div>
            <div>
              <h1 className="heading-3 text-[#2E1B4D] mb-2">
                {t("payment.authorized")}
              </h1>
              <p className="text-[#6F5D9E] mb-6 whitespace-pre-line">
                {errorMessage}
              </p>
              <p className="text-sm text-[#6F5D9E]">
                {t("payment.bookingId")} <span className="font-mono">{bookingId}</span>
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                size="large"
                className="w-full !h-14"
                onClick={() =>
                  navigate("/booking/success", {
                    state: { bookingId },
                    replace: true,
                  })
                }
              >
                {t("payment.continue")}
              </Button>
              <Button
                variant="default"
                size="large"
                className="w-full !h-14"
                onClick={() => navigate("/")}
              >
                {t("payment.returnHome")}
              </Button>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
            </div>
            <div>
              <h1 className="heading-3 text-[#2E1B4D] mb-2">
                {t("payment.failed")}
              </h1>
              <p className="text-[#6F5D9E] mb-6 whitespace-pre-line">
                {errorMessage}
              </p>

              {import.meta.env.DEV && (
                <details className="text-left bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <summary className="cursor-pointer text-sm font-semibold text-red-800 mb-2">
                    {t("payment.debug")}
                  </summary>
                  <div className="text-xs font-mono text-red-700 space-y-2">
                    <div>
                      <strong>{t("payment.errorCode")}</strong> {errorDetails?.resultCode || "N/A"}
                    </div>
                    <div>
                      <strong>{t("payment.description")}</strong> {errorDetails?.resultDescription || "N/A"}
                    </div>
                    <div>
                      <strong>{t("payment.bookingId")}</strong> {errorDetails?.bookingId || bookingId}
                    </div>
                    <div>
                      <strong>{t("payment.resourcePath")}</strong> {resolvedResourcePath || "missing"}
                    </div>
                    <div>
                      <strong>{t("payment.frontendUrl")}</strong> {import.meta.env.VITE_HYPERPAY_URL}
                    </div>
                    <div>
                      <strong>{t("payment.apiBaseUrl")}</strong> {import.meta.env.VITE_API_BASE_URL}
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
                onClick={() => navigate(-1)}
              >
                {t("payment.backToBooking")}
              </Button>
              <Button
                variant="default"
                size="large"
                className="w-full !h-14"
                onClick={() => navigate("/")}
              >
                {t("payment.returnHome")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
