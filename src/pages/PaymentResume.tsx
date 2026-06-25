import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/common/Button";
import authService from "@/api/services/authService";
import bookingService, { type BookingDetails } from "@/api/services/bookingService";
import singerService, { type Singer } from "@/api/services/singerService";
import paymentService from "@/api/services/paymentService";
import HyperPayWidget from "@/components/pageComponents/BookingSinger/HyperPayWidget";
import { toast } from "sonner";

// Persisted payment statuses for a booking the customer can still pay for.
// Mirrors the backend prepareCheckout allow-list (awaiting_payment / checkout_prepared / failed).
const RESUMABLE_PAYMENT_STATUSES = new Set([
  "awaiting_payment",
  "checkout_prepared",
  "checkout_expired",
  "failed",
]);

const isResumable = (booking: BookingDetails): boolean =>
  RESUMABLE_PAYMENT_STATUSES.has((booking.paymentStatus || "awaiting_payment").toLowerCase());

const PaymentResume: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams<{ bookingId: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [singer, setSinger] = useState<Singer | null>(null);

  // Payment widget state
  const [proceeding, setProceeding] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string>("");
  const [integrity, setIntegrity] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Redirect to login (preserving return path) if not authenticated
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/auth/login", { state: { from: location.pathname } });
    }
  }, [navigate, location.pathname]);

  // Load booking + singer
  useEffect(() => {
    if (!bookingId || !authService.isAuthenticated()) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { booking: fetched } = await bookingService.getBookingById(bookingId);
        if (cancelled) return;

        if (!fetched || !fetched.bookingId) {
          setError("We couldn't find this booking.");
          return;
        }

        setBooking(fetched);

        if (!isResumable(fetched)) {
          setAlreadyPaid(true);
          return;
        }

        setAmount(fetched.totalAmount != null ? Number(fetched.totalAmount) : null);

        if (fetched.singerId) {
          const singerData = await singerService.getSingerById(fetched.singerId);
          if (!cancelled && singerData) {
            setSinger(singerData);
            if (!fetched.totalAmount) {
              const basePrice = singerData.pricing?.base_price;
              setAmount(basePrice != null ? Number(basePrice) : null);
            }
          }
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          (err as { response?: { data?: { message?: string }; status?: number } })?.response
            ?.data?.message ||
          "Failed to load this booking. Please try again.";
        const status = (err as { response?: { status?: number } })?.response?.status;
        setError(status === 403 ? "You are not authorized to pay for this booking." : message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const handleProceed = async () => {
    if (!bookingId) return;
    setProceeding(true);
    setPaymentError(null);
    setCheckoutId("");
    setIntegrity(null);

    try {
      const response = await paymentService.prepareCheckout(bookingId);
      if (response?.checkoutId && response?.integrity) {
        setCheckoutId(response.checkoutId);
        setIntegrity(response.integrity);
        if (response.amount) {
          setAmount(typeof response.amount === "string" ? parseFloat(response.amount) : response.amount);
        }
      } else {
        setPaymentError("Invalid checkout response from server.");
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as { message?: string })?.message ||
        "Failed to initialize payment. Please try again.";
      setPaymentError(message);
      toast.error(message);
    } finally {
      setProceeding(false);
    }
  };

  if (loading) {
    return (
      <div className="custom-container py-24 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-[#6F5D9E]">Loading your booking...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="custom-container py-24">
        <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 shadow-lg border border-[#E7DEFF] text-center space-y-4">
          <p className="text-red-600 font-semibold">{error}</p>
          <Button variant="primary" className="!h-12" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (alreadyPaid) {
    return (
      <div className="custom-container py-24">
        <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 shadow-lg border border-[#E7DEFF] text-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
          <h1 className="heading-2 text-[#2E1B4D]">This booking is already paid</h1>
          <p className="text-[#6F5D9E]">
            No further payment is needed. You can track this booking from your portal.
          </p>
          <Link
            to="/"
            className="inline-block text-primary font-semibold underline-offset-4 hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-container py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-[#6F5D9E] hover:text-primary mb-4"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E7DEFF] text-primary bg-white">
              <ArrowLeft className="h-4 w-4" />
            </span>
          </button>
          <div className="w-full text-center">
            <h1 className="heading-2 text-[#2E1B4D]">Complete Your Payment</h1>
            <p className="text-[#6F5D9E] mt-2">
              Review your booking details and finish paying to confirm it.
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#E7DEFF] space-y-6">
          {/* Event Details */}
          <div>
            <h3 className="text-lg font-semibold text-[#2E1B4D] mb-3 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Event Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6F5D9E]">Singer:</span>
                <span className="text-[#2E1B4D] font-medium">{booking?.singerName || singer?.name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F5D9E]">Date:</span>
                <span className="text-[#2E1B4D] font-medium">
                  {booking?.eventDate ? new Date(booking.eventDate).toLocaleDateString() : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F5D9E]">Time:</span>
                <span className="text-[#2E1B4D] font-medium">{booking?.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F5D9E]">Event Type:</span>
                <span className="text-[#2E1B4D] font-medium">{booking?.eventType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F5D9E]">Guests:</span>
                <span className="text-[#2E1B4D] font-medium">{booking?.numberOfGuests}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#E7DEFF]" />

          {/* Venue */}
          <div>
            <h3 className="text-lg font-semibold text-[#2E1B4D] mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Venue Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6F5D9E]">Venue:</span>
                <span className="text-[#2E1B4D] font-medium">{booking?.venueName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F5D9E]">Address:</span>
                <span className="text-[#2E1B4D] font-medium text-right max-w-xs">{booking?.venueAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F5D9E]">City:</span>
                <span className="text-[#2E1B4D] font-medium">{booking?.city}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#E7DEFF]" />

          {/* Payment */}
          <div>
            <h3 className="text-lg font-semibold text-[#2E1B4D] mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Summary
            </h3>
            <div className="flex justify-between text-lg">
              <span className="text-[#2E1B4D] font-bold">Total:</span>
              <span className="text-[#2E1B4D] font-bold">
                {amount != null && Number.isFinite(amount) ? `SAR ${amount.toFixed(2)}` : "—"}
              </span>
            </div>
          </div>

          {/* Action / Widget */}
          <div className="mt-2">
            {paymentError && (
              <div className="text-center py-6 space-y-3">
                <p className="text-red-600 text-sm">{paymentError}</p>
                <Button variant="primary" className="!h-12" onClick={handleProceed}>
                  Retry Payment
                </Button>
              </div>
            )}

            {!paymentError && !checkoutId && (
              <Button
                variant="primary"
                className="!h-12 w-full"
                onClick={handleProceed}
                disabled={proceeding}
              >
                {proceeding ? "Preparing secure payment..." : "Proceed to Payment"}
              </Button>
            )}

            {!paymentError && checkoutId && integrity && bookingId && (
              <HyperPayWidget checkoutId={checkoutId} bookingId={bookingId} integrity={integrity} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResume;
