import axiosInstance from '../axiosInstance';

// Types
export interface RegisterUserData {
  first_name: string;
  last_name: string;
  phonenumber: string;
  email?: string;
  gender?: string;
  intro_vid_link?: string;
  city?: string;
  address?: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
  otp: string;
}

export interface VerifyUserData {
  userId: string;
  otp: string;
}

export interface VerifyResponse {
  message: string;
  userId: string;
}

export interface LoginUserData {
  phonenumber: string;
  password: string;
}

export interface UserMetadata {
  userId: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user_metadata: UserMetadata;
}

export interface UserProfileResponse {
  userId: string;
  name: string;
  role: string;
}

export interface SendResetCodeData {
  phonenumber: string;
}

export interface SendResetCodeResponse {
  message: string;
  userId: string;
}

export interface ResetPasswordData {
  userId: string;
  resetPasswordCode: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ResendOtpData {
  userId: string;
}

export interface ResendOtpResponse {
  message: string;
  otp?: string;
}

// Custom event for auth state changes
const AUTH_EVENT = 'auth-state-changed';

export const dispatchAuthEvent = () => {
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
};

export const subscribeToAuthChanges = (callback: () => void) => {
  window.addEventListener(AUTH_EVENT, callback);
  return () => window.removeEventListener(AUTH_EVENT, callback);
};

// Auth Service Functions
const authService = { 
  /**
   * Register a new user
   * @param role - 'user' or 'singer'
   * @param userData - User registration data
   */
  register: async (role: 'user' | 'singer', userData: RegisterUserData): Promise<RegisterResponse> => {
    const response = await axiosInstance.post<RegisterResponse>(
      `/auth/register?role=${encodeURIComponent(role)}`,
      userData
    );
    return response.data;
  },

  /**
   * Verify user with OTP
   * @param verifyData - userId and OTP code
   */
  verifyUser: async (verifyData: VerifyUserData): Promise<VerifyResponse> => {
    const response = await axiosInstance.post<VerifyResponse>(
      '/auth/verify-user',
      verifyData
    );
    return response.data;
  },

  /**
   * Login user
   * @param loginData - Phone number and password
   */
  login: async (loginData: LoginUserData): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      '/auth/login',
      loginData
    );
    
    // Store token and user data in localStorage
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user_metadata));
      
      // Notify other components of auth state change
      dispatchAuthEvent();
    }
    
    return response.data;
  },

  /**
   * Check authentication and get user profile
   * Requires authentication token in headers
   */
  checkAuth: async (): Promise<UserProfileResponse> => {
    const response = await axiosInstance.get<UserProfileResponse>('/auth/check-auth');
    return response.data;
  },

  /**
   * Logout user
   * Clears local storage and removes auth token
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Notify other components of auth state change
    dispatchAuthEvent();
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: (): UserMetadata | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as UserMetadata;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  /**
   * Send reset password code to phone number
   * @param data - Phone number
   */
  sendResetPasswordCode: async (data: SendResetCodeData): Promise<SendResetCodeResponse> => {
    const response = await axiosInstance.post<SendResetCodeResponse>(
      '/auth/send-reset-password-code',
      data
    );
    return response.data;
  },

  /**
   * Reset forgotten password with code
   * @param data - userId, resetPasswordCode, and newPassword
   */
  resetForgottenPassword: async (data: ResetPasswordData): Promise<ResetPasswordResponse> => {
    const response = await axiosInstance.post<ResetPasswordResponse>(
      '/auth/reset-forgotten-password',
      data
    );
    return response.data;
  },

  /**
   * Resend OTP for user verification
   * @param data - userId
   */
  resendOtp: async (data: ResendOtpData): Promise<ResendOtpResponse> => {
    const response = await axiosInstance.post<ResendOtpResponse>(
      '/auth/resend-otp',
      data
    );
    return response.data;
  },
};

export default authService;