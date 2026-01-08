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
  DOB?: string;
  iqama_number?: string;
}

export interface RegisterResponse {
  token: string;
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
  phonenumber?: string;
  email?: string;
  password: string;
}

export interface UserMetadata {
  userId: string;
  name: string;
  role: string;
  email?: string;
  phoneNumber?: string;
}

export interface LoginResponse {
  message: string;
  user_metadata: UserMetadata;
}

export interface UserProfileResponse {
  userId: string;
  name: string;
  role: string;
  email?: string;
  phoneNumber?: string;
}

export interface SendResetCodeData {
  phonenumber?: string;
  email?: string;
  fromphonenumber: boolean;
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
  newphonenumber?: string;
  newemail?: string;
  fromphonenumber: boolean;
}

export interface ResendOtpResponse {
  message: string;
  otp?: string;
}

export interface SendOtpData {
  userId: string;
  fromphonenumber: boolean;
}

export interface SendOtpResponse {
  message: string;
  otp?: string;
}

// Custom event for auth state changes
const AUTH_EVENT = 'auth-state-changed';

export const dispatchAuthEvent = () => {
  console.log('🔔 Dispatching auth-state-changed event');
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
};

export const subscribeToAuthChanges = (callback: () => void) => {
  console.log('📡 Component subscribed to auth-state-changed events');
  window.addEventListener(AUTH_EVENT, callback);
  return () => {
    console.log('📡 Component unsubscribed from auth-state-changed events');
    window.removeEventListener(AUTH_EVENT, callback);
  };
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
    
    console.log('Verify User Response:', response);
    console.log('Verify Response Headers:', response.headers);
    console.log('Verify Response Data:', response.data);
    
    // Get token from response headers (backend sends as 'Authorization')
    let token = response.headers['Authorization'] || response.headers['authorization'];
    console.log('Token from verify headers:', token);
    
    // If not in headers, check response data (fallback)
    if (!token && (response.data as any).token) {
      token = (response.data as any).token;
      console.log('Token found in verify response data instead:', token);
    }
    
    // Store token and user data in localStorage if token is present
    if (token) {
      // Remove 'Bearer ' prefix if present
      const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
      console.log('Clean token to store from verify:', cleanToken);
      localStorage.setItem('authToken', cleanToken);
      
      // Store user metadata if available
      if ((response.data as any).user_metadata) {
        localStorage.setItem('user', JSON.stringify((response.data as any).user_metadata));
        console.log('User stored in localStorage from verify:', localStorage.getItem('user'));
      }
      
      console.log('Token stored in localStorage from verify:', localStorage.getItem('authToken'));
      
      // Notify other components of auth state change
      console.log('Dispatching auth event from verify...');
      dispatchAuthEvent();
    }
    
    return response.data;
  },

  /**
   * Login user
   * @param loginData - Phone number or email and password
   */
  login: async (loginData: LoginUserData): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      '/auth/login',
      loginData
    );
    
    console.log('Login Response:', response);
    console.log('Response Headers:', response.headers);
    console.log('Response Data:', response.data);
    console.log('All header keys:', Object.keys(response.headers));
    
    // Get token from response headers (backend sends as 'Authorization')
    let token = response.headers['Authorization'] || response.headers['authorization'];
    console.log('Token from headers:', token);
    
    // If not in headers, check response data (fallback)
    if (!token && (response.data as any).token) {
      token = (response.data as any).token;
      console.log('Token found in response data instead:', token);
    }
    
    // Store token and user data in localStorage
    if (token) {
      // Remove 'Bearer ' prefix if present
      const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
      console.log('Clean token to store:', cleanToken);
      localStorage.setItem('authToken', cleanToken);
      localStorage.setItem('user', JSON.stringify(response.data.user_metadata));
      console.log('Token stored in localStorage:', localStorage.getItem('authToken'));
      console.log('User stored in localStorage:', localStorage.getItem('user'));
      
      // Notify other components of auth state change
      console.log('Dispatching auth event...');
      dispatchAuthEvent();
    } else {
      console.error('No token found in response headers OR response data!');
      console.error('Please check backend CORS configuration to expose Authorization header');
    }
    
    return response.data;
  },

  /**
   * Check authentication and get user profile
   * Requires authentication token in headers
   */
  checkAuth: async (): Promise<UserProfileResponse> => {
    const response = await axiosInstance.get<UserProfileResponse>('/auth/check-auth');
    console.log('checkAuth - Full Response:', response);
    console.log('checkAuth - Response Data:', response.data);

    // Handle potential field name variations from backend
    const data = response.data as any;
    console.log(data,"data")

    // Ensure proper field names - backend might return 'phonenumber' instead of 'phoneNumber'
    const normalizedData: UserProfileResponse = {
      userId: data.userId || data.user_id || data.id,
      name: data.name || data.full_name || data.firstName,
      role: data.role,
      email: data.email || null,
      phoneNumber: data.phoneNumber || data.phonenumber || data.phone_number || null,
    };

    console.log('checkAuth - Normalized Data:', normalizedData);
    console.log('checkAuth - Email:', normalizedData.email);
    console.log('checkAuth - PhoneNumber:', normalizedData.phoneNumber);
    console.log('checkAuth - Name:', normalizedData.name);

    return normalizedData;
  },

  /**
   * Logout user
   * Calls backend API to clear token and clears local storage
   */
  logout: async (): Promise<void> => {
    try {
      // Call logout API (DELETE request)
      await axiosInstance.delete('/auth/logout');
      
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Notify other components of auth state change
      dispatchAuthEvent();
    } catch (error) {
      console.error('Logout API failed:', error);
      // Even if API fails, clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      dispatchAuthEvent();
      throw error;
    }
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: (): UserMetadata | null => {
    const userStr = localStorage.getItem('user');
    console.log('getCurrentUser - userStr from localStorage:', userStr);
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr) as UserMetadata;
      console.log('getCurrentUser - parsed user:', user);
      return user;
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
    console.log('isAuthenticated - token:', token);
    console.log('isAuthenticated - result:', !!token);
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
   * @param data - userId, fromphonenumber, and optional newphonenumber or newemail
   */
  resendOtp: async (data: ResendOtpData): Promise<ResendOtpResponse> => {
    const response = await axiosInstance.post<ResendOtpResponse>(
      '/auth/resend-otp',
      data
    );
    return response.data;
  },

  /**
   * Send OTP to user via email or phone
   * @param data - userId and fromphonenumber (false for email, true for phone)
   */
  sendOtp: async (data: SendOtpData): Promise<SendOtpResponse> => {
    const response = await axiosInstance.post<SendOtpResponse>(
      '/auth/send-otp',
      data
    );
    return response.data;
  },

  /**
   * Upload verification document for singer
   * @param documentType - 'national_id' or 'passport'
   * @param file - The document file to upload
   */
  uploadVerificationDocument: async (documentType: string, file: File): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('document', file);

    const response = await axiosInstance.post<{ message: string }>(
      '/singer/upload-verification-document',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

export default authService;