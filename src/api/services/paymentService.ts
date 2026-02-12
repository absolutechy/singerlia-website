import axiosInstance from '../axiosInstance';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CreateCheckoutResponse {
  checkoutId: string;
  amount: number;
  currency: string;
  integrity: string; // SRI hash for PCI DSS 4.x compliance
}

export interface PaymentStatusResponse {
  message: string;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'checkout_prepared' | 'pre_authorized';
  bookingId: string;
  amount: string;
  paymentId?: string;
  paymentBrand?: string;
  resultCode?: string;
  resultDescription?: string;
  requiresCapture?: boolean; // For PA transactions
}

// ============================================================================
// PAYMENT SERVICE
// ============================================================================

const paymentService = {
  /**
   * Create a HyperPay checkout session for a booking.
   * Returns the checkoutId needed to load the payment widget.
   */
  createCheckout: async (bookingId: string): Promise<CreateCheckoutResponse> => {
    const response = await axiosInstance.post<CreateCheckoutResponse>(
      '/payment/checkouts',
      { bookingId }
    );
    return response.data;
  },

  /**
   * Get the payment status for a booking after HyperPay redirect.
   * @param bookingId - The booking ID
   * @param resourcePath - Optional resourcePath from HyperPay redirect (required for proper verification)
   */
  getPaymentStatus: async (bookingId: string, resourcePath?: string): Promise<PaymentStatusResponse> => {
    const params = new URLSearchParams();
    if (resourcePath) {
      params.append('resourcePath', resourcePath);
    }
    
    const url = `/payment/status/${bookingId}${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await axiosInstance.get<PaymentStatusResponse>(url);
    return response.data;
  },
};

export default paymentService;
