import React, { useEffect, useState, useRef, useMemo } from "react";
import { generateNonce, generateCSPContent, getHyperPayUrl } from "@/lib/hyperPayUtils";

interface HyperPayWidgetProps {
  checkoutId: string;
  bookingId: string;
  integrity: string; // SRI hash from backend for PCI DSS 4.x compliance
}

const HyperPayWidget: React.FC<HyperPayWidgetProps> = ({
  checkoutId,
  bookingId,
  integrity,
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const configScriptRef = useRef<HTMLScriptElement | null>(null);
  const cspMetaRef = useRef<HTMLMetaElement | null>(null);
  
  // Generate a unique nonce for CSP - memoized so it stays consistent during component lifecycle
  const nonce = useMemo(() => generateNonce(), []);
  
  // Get HyperPay URL based on environment
  const hyperPayUrl = getHyperPayUrl();

  // Add CSP meta tag to document head
  useEffect(() => {
    console.log("[HyperPay] Adding Content Security Policy meta tag (PCI DSS 4.x)");
    
    const meta = document.createElement("meta");
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = generateCSPContent(nonce);
    
    document.head.appendChild(meta);
    cspMetaRef.current = meta;
    
    return () => {
      if (cspMetaRef.current && document.head.contains(cspMetaRef.current)) {
        document.head.removeChild(cspMetaRef.current);
      }
    };
  }, [nonce]);

  useEffect(() => {
    if (!checkoutId || !integrity) {
      console.error("[HyperPay] Missing required props:", { checkoutId, integrity });
      return;
    }

    console.log("[HyperPay] Loading widget for checkoutId:", checkoutId);
    console.log("[HyperPay] Using SRI integrity hash (PCI DSS 4.x)");
    console.log("[HyperPay] HyperPay URL:", hyperPayUrl);

    // Create payment widget script with SRI (Subresource Integrity)
    const script = document.createElement("script");
    script.src = `${hyperPayUrl}/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
    script.integrity = integrity; // SRI hash from backend
    script.crossOrigin = "anonymous"; // Required for SRI validation
    script.async = true;

    script.onload = () => {
      console.log("[HyperPay] Payment widget script loaded successfully");
      
      // Add 3D Secure configuration script after payment widget loads
      const configScript = document.createElement("script");
      configScript.type = "text/javascript";
      configScript.nonce = nonce; // Use the same nonce as CSP policy
      configScript.textContent = `
        var wpwlOptions = {
          paymentTarget: "_top",
          style: "card",
        };
      `;
      
      document.head.appendChild(configScript);
      configScriptRef.current = configScript;
      
      console.log("[HyperPay] 3D Secure configuration applied");
      setScriptLoaded(true);
    };

    script.onerror = (error) => {
      console.error("[HyperPay] Failed to load payment widget script:", error);
      console.error("[HyperPay] This could be due to:");
      console.error("  - Network connectivity issues");
      console.error("  - CSP policy blocking the script");
      console.error("  - Invalid SRI integrity hash");
      console.error("  - HyperPay service unavailable");
      setScriptError(true);
    };

    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      console.log("[HyperPay] Cleaning up widget");
      
      // Remove the payment widget script
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
      
      // Remove the configuration script
      if (configScriptRef.current && document.head.contains(configScriptRef.current)) {
        document.head.removeChild(configScriptRef.current);
      }

      // Clean up HyperPay widget DOM elements
      document
        .querySelectorAll(".wpwl-container, .wpwl-form, [class^='wpwl']")
        .forEach((el) => el.remove());
    };
  }, [checkoutId, integrity, nonce, hyperPayUrl]);

  const shopperResultUrl = `${import.meta.env.VITE_APP_URL}/payment/result?bookingId=${bookingId}`;
  console.log("[HyperPay] Shopper result URL:", shopperResultUrl);

  if (scriptError) {
    return (
      <div className="text-center py-6">
        <p className="text-red-600 mb-2 font-semibold">
          Failed to load payment form
        </p>
        <p className="text-gray-600 text-sm mb-4">
          Please check your connection and try again. If the problem persists, contact support.
        </p>
        <details className="text-left bg-gray-50 p-4 rounded-lg text-xs text-gray-700">
          <summary className="cursor-pointer font-medium mb-2">Technical Details</summary>
          <ul className="list-disc pl-5 space-y-1">
            <li>Network connectivity issues</li>
            <li>Content Security Policy (CSP) blocking</li>
            <li>Invalid security integrity hash</li>
            <li>Payment service temporarily unavailable</li>
          </ul>
        </details>
      </div>
    );
  }

  return (
    <div>
      {!scriptLoaded && (
        <div className="flex items-center justify-center py-8 gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-[#6F5D9E] text-sm">Loading secure payment form...</span>
        </div>
      )}

      {/* HyperPay Payment Form - Will be injected by the widget script */}
      <form
        action={shopperResultUrl}
        className="paymentWidgets"
        data-brands="VISA MASTER MADA"
      />
    </div>
  );
};

export default HyperPayWidget;
