/**
 * Generate a cryptographically secure random nonce for CSP
 * Used for PCI DSS 4.x compliance with HyperPay integration
 * @returns Base64 encoded nonce string
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Get the HyperPay base URL based on environment
 * @returns HyperPay base URL (test or production)
 */
export function getHyperPayUrl(): string {
  return import.meta.env.VITE_HYPERPAY_URL || 'https://eu-prod.oppwa.com';
}

/**
 * Generate CSP meta content for HyperPay integration
 * @param nonce - The nonce value to use in the CSP policy
 * @returns CSP content string
 */
export function generateCSPContent(nonce: string): string {
  const hyperPayUrl = getHyperPayUrl();
  
  return `
    style-src 'self' ${hyperPayUrl} 'unsafe-inline' ;
    frame-src 'self' ${hyperPayUrl};
    script-src 'self' ${hyperPayUrl} https://mpsnare.iesnare.com 'nonce-${nonce}' ;
    worker-src 'self' ${hyperPayUrl} blob: ;
    connect-src 'self' ${hyperPayUrl} https://mpsnare.iesnare.com;
    img-src 'self' ${hyperPayUrl} https://mpsnare.iesnare.com data:;
  `.trim().replace(/\s+/g, ' ');
}
