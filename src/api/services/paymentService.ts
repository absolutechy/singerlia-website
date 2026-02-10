import axiosInstance from '../axiosInstance';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CreateCheckoutResponse {
  checkoutId: string;
  amount: number;
  currency: string;
}

export interface PaymentStatusResponse {
  status: 'success' | 'pending' | 'failed';
  bookingId: string;
  amount: number;
  resultCode?: string;
  resultDescription?: string;
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
   */
  getPaymentStatus: async (bookingId: string): Promise<PaymentStatusResponse> => {
    const response = await axiosInstance.get<PaymentStatusResponse>(
      `/payment/status/${bookingId}`
    );
    return response.data;
  },
};

export default paymentService;
