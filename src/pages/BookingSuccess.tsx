import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { CheckCircle2, LayoutDashboard, Home, AlertCircle } from "lucide-react";
import Button from "@/components/common/Button";
import paymentService from "@/api/services/paymentService";
import authService from "@/api/services/authService";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

const BookingSuccess: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState(t("payment.verifyingShort"));
  const [paymentId, setPaymentId] = useState("");

  const searchParams = new URLSearchParams(location.search);
  // Prefer the bookingId handed over by PaymentResult (the booking it just verified).
  // Fall back to the URL query, then to localStorage — the latter can be stale when the
  // customer resumed an older booking, so it must be the lowest priority.
  const stateBookingId = (location.state as { bookingId?: string } | null)?.bookingId;
  const bookingId =
    stateBookingId ||
    searchParams.get("bookingId") ||
    localStorage.getItem("currentBookingId") ||
    "";
  const resourcePath = searchParams.get("resourcePath") || "";

  // Guards against this effect actually running its network calls twice for the same
  // booking+resourcePath — React 19 StrictMode double-invokes effects in dev (mount → cleanup →
  // mount), and with no guard that fired getPaymentStatus/capturePayment twice back-to-back,
  // which could race against itself at HyperPay (one of the two capture calls would get
  // rejected, e.g. "PA value exceeded, PA reverted") even though the backend's own idempotency
  // layer (withIdempotency, keyed per booking) ultimately still prevented any double-charge.
  const verifiedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const verifyAndCapture = async () => {
      if (!bookingId) {
        setMessage(t("payment.bookingMissing"));
        setLoading(false);
        return;
      }

      const key = `${bookingId}:${resourcePath}`;
      if (verifiedKeyRef.current === key) return;
      verifiedKeyRef.current = key;

      try {
        const status = await paymentService.getPaymentStatus(
          bookingId,
          resourcePath || undefined
        );

        setPaymentId(status.paymentId || "");

        if (status.paymentStatus === "paid") {
          setIsSuccess(true);
          setMessage(t("payment.confirmedMerchant"));
          toast.success(t("payment.verifiedToast"));
        } else if (
          status.paymentStatus === "pre_authorized" ||
          status.requiresCapture
        ) {
          const capture = await paymentService.capturePayment(
            bookingId,
            status.amount
          );
          if (capture.paymentStatus === "paid") {
            setIsSuccess(true);
            setMessage(
              t("payment.capturedMerchant")
            );
            toast.success(t("payment.capturedToast"));
          } else if (capture.paymentStatus === "pre_authorized" && capture.requiresCapture) {
            setIsSuccess(true);
            setMessage(
              capture.message ||
                t("payment.authorizedPending")
            );
            toast.success(t("payment.authorizedToast"));
          } else {
            setMessage(capture.message || t("payment.captureFailed"));
          }
        } else {
          setMessage(status.message || t("payment.failedOrPending"));
        }
      } catch (error: any) {
        setMessage(
          error.response?.data?.message ||
            error.message ||
            t("payment.verificationFailed")
        );
      } finally {
        localStorage.removeItem("currentBookingId");
        setLoading(false);
      }
    };

    verifyAndCapture();
  }, [bookingId, resourcePath, t]);

  return (
    <div className="custom-container min-h-screen flex items-center justify-center ">
      <div className="max-w-2xl w-full">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div
              className={`w-32 h-32 rounded-3xl flex items-center justify-center ${
                isSuccess
                  ? "bg-gradient-to-br from-green-400 via-emerald-300 to-teal-400"
                  : "bg-gradient-to-br from-amber-400 via-orange-300 to-red-400"
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={2.5} />
              ) : (
                <AlertCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
              )}
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-5xl font-bold text-[#2E1B4D] mb-4">
            {loading
              ? t("payment.processing")
              : isSuccess
                ? t("payment.completed")
                : t("payment.notCompleted")}
          </h1>
          <p className="text-[#6F5D9E] text-lg">{message}</p>
          {bookingId && (
            <p className="text-sm text-[#6F5D9E] mt-2">
              {t("payment.bookingId")} <span className="font-mono">{bookingId}</span>
            </p>
          )}
          {paymentId && (
            <p className="text-sm text-[#6F5D9E]">
              {t("payment.paymentId")} <span className="font-mono">{paymentId}</span>
            </p>
          )}
        </div>

        {!loading && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a
              className="px-10 py-4 !text-lg h-14 flex-1 flex justify-center items-center rounded-lg bg-gradient-to-b from-secondary to-secondary-dark text-[#2e2e2e] hover:from-[#ffed4e] hover:to-[#d4a04a] shadow-md hover:shadow-lg"
              href={authService.getPortalDashboardUrl()}
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              {t("payment.visitDashboard")}
            </a>
            <Button
              variant="default"
              size="large"
              className="flex-1 !h-14 text-base !bg-yellow-500 !text-white hover:!bg-yellow-600"
              onClick={() => navigate("/")}
            >
              <Home className="w-5 h-5 mr-2" />
              {t("payment.continueHome")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSuccess;
