import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { CheckCircle2, LayoutDashboard, Home } from "lucide-react";
import Button from "@/components/common/Button";

interface LocationState {
  bookingId?: string;
  totalAmount?: number;
  paymentStatus?: string;
}

const BookingSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  // Fallback: read bookingId from state → URL params → localStorage
  const searchParams = new URLSearchParams(location.search);
  const bookingId =
    state?.bookingId ||
    searchParams.get("bookingId") ||
    localStorage.getItem("currentBookingId") ||
    undefined;

  useEffect(() => {
    // Clear booking data from localStorage
    localStorage.removeItem("currentBookingId");
  }, []);

  return (
    <div className="custom-container min-h-screen flex items-center justify-center ">
      <div className="max-w-2xl w-full">

        {/* Success Badge */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center animate-pulse">
              <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 text-yellow-400 text-2xl animate-bounce">
              🎵
            </div>
            <div className="absolute -bottom-2 -left-2 text-purple-400 text-2xl animate-bounce delay-100">
              ✨
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-5xl font-bold text-[#2E1B4D] mb-4">
            Your booking has been successfully made!
          </h1>
          <p className="text-[#6F5D9E] text-lg">
            Your payment has been securely authorized.
          </p>
        </div>

        {/* Booking Details Box */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Awaiting Artist Decision
              </h3>
              <p className="text-green-700 text-sm leading-relaxed">
                Your request has been sent! The artist has <strong>24 hours</strong> to review and confirm your booking.
                You will not be charged until the artist accepts.
                {bookingId && (
                  <span className="block mt-2 font-medium">
                    Booking ID: <span className="font-mono">{bookingId}</span>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <p className="text-center text-[#6F5D9E] text-sm mb-8">
          The singer typically responds within{" "}
          <span className="font-semibold text-primary">24-48 hours</span>. 
          We'll notify you once they approve your booking request.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <a
            className="px-10 py-4 !text-lg h-14 flex-1 flex justify-center items-center rounded-lg bg-gradient-to-b from-secondary to-secondary-dark text-[#2e2e2e] hover:from-[#ffed4e] hover:to-[#d4a04a] shadow-md hover:shadow-lg"
            href="https://portal.singerlia.com/"
          >
            <LayoutDashboard className="w-5 h-5 mr-2" />
            Visit Dashboard
          </a>
          <Button
            variant="default"
            size="large"
            className="flex-1 !h-14 text-base !bg-yellow-500 !text-white hover:!bg-yellow-600"
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5 mr-2" />
            Continue to Home
          </Button>
        </div>

        {/* Support Information */}
        <div className="text-center">
          <p className="text-[#6F5D9E] text-sm mb-2">
            If you have any questions or concerns, please contact our customer service team.
          </p>
          <p className="text-sm">
            <span className="text-[#6F5D9E]">Need immediate assistance? Email us at </span>
            <a
              href="mailto:support@singerlia.com"
              className="text-primary hover:underline font-medium"
            >
              support@singerlia.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
