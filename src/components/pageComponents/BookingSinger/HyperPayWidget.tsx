import React, { useEffect, useState, useRef } from "react";

interface HyperPayWidgetProps {
  checkoutId: string;
  bookingId: string;
}

const HyperPayWidget: React.FC<HyperPayWidgetProps> = ({
  checkoutId,
  bookingId,
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!checkoutId) return;

    console.log("[HyperPay] Loading widget for checkoutId:", checkoutId);

    const hyperPayUrl = import.meta.env.VITE_HYPERPAY_URL;
    console.log("[HyperPay] HyperPay URL:", hyperPayUrl);

    const script = document.createElement("script");
    script.src = `${hyperPayUrl}/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
    script.async = true;

    script.onload = () => {
      console.log("[HyperPay] Script loaded successfully");
      setScriptLoaded(true);
    };

    script.onerror = () => {
      console.error("[HyperPay] Failed to load script");
      setScriptError(true);
    };

    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      console.log("[HyperPay] Cleaning up widget");
      // Remove the script
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }

      // Clean up HyperPay widget DOM elements
      document
        .querySelectorAll(".wpwl-container, .wpwl-form, [class^='wpwl']")
        .forEach((el) => el.remove());
    };
  }, [checkoutId]);

  const shopperResultUrl = `${import.meta.env.VITE_APP_URL}/payment/result?bookingId=${bookingId}`;
  console.log("[HyperPay] Shopper result URL:", shopperResultUrl);

  if (scriptError) {
    return (
      <div className="text-center py-6">
        <p className="text-red-600 mb-2">
          Failed to load payment form. Please check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div>
      {!scriptLoaded && (
        <div className="flex items-center justify-center py-8 gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-[#6F5D9E] text-sm">Loading payment form...</span>
        </div>
      )}

      <form
        action={shopperResultUrl}
        className="paymentWidgets"
        data-brands="VISA MASTER MADA"
      />
    </div>
  );
};

export default HyperPayWidget;
