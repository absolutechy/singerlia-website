import axiosInstance from '../axiosInstance';

// Types
export interface SingerSearchParams {
  // Comma-separated genreIds, e.g. "pop,classical" — OR-matched.
  genre?: string;
  city?: string;
  address?: string;
  name?: string;
  limit?: number;
  page?: number;
  highlight?: 'featured' | '';
  eventCategory?: string;
}

export interface Review {
  reviewId: string;
  singerId: string;
  userName: string;
  rating: string;
  comment: string;
  createdAt: string;
}

// Per-event-category prices, e.g. { weddings: { price: 3500 } }. Absent key = singer doesn't
// offer/price that category. Replaces the old flat base_price/extra_hour_price/location_surcharge.
export type CategoryPricing = Record<string, { price: number; updatedAt?: string }>;

export interface PhotoFile {
  fileName: string;
  fileType: string;
  s3Path: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
}

export interface SingerProfile {
  userId: string;
  bio: string;
  experience: string;
  social_links: SocialLinks;
  photos: PhotoFile[];
  youtube_links: string[];
  // Presigned, publicly-loadable URLs — set by the backend only when the singer has actually
  // uploaded one (see the singer portal's Profile Photos section). null/undefined otherwise;
  // callers should fall back to a default image rather than rendering a broken <img>.
  avatarPhotoUrl?: string | null;
  coverPhotoUrl?: string | null;
}

export interface Singer {
  userId: string;
  name: string;
  phonenumber: string;
  email: string;
  // Stable genre slugs (see genreService.ts) — replaces the old free-text genre string.
  genreIds: string[];
  intro_vid_link: string | null;
  city: string;
  address: string | null;
  joinedAt: string;
  isVerified: boolean;
  categoryPricing: CategoryPricing;
  // Only present when a `?eventCategory=` filter was applied to the search.
  matchedCategoryPrice?: number | null;
  reviews: Review[];
  highlight: string;
  isSingerApproved: boolean;
  singerProfile?: SingerProfile;
  // Average time this singer has taken to reply to a customer's first message, in whole hours.
  // null — not 0 — until they've actually replied to at least one message; render nothing for
  // null rather than claiming a response time with no evidence behind it.
  responseTimeHours: number | null;
  // Up to 3 presigned, publicly-loadable portfolio photo thumbnails for the search-card
  // carousel. Empty when the singer hasn't uploaded any portfolio photos yet — fall back to the
  // card's own default images rather than rendering an empty carousel.
  photoUrls: string[];
}

export interface SingerSearchResponse {
  singers: Singer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const singerService = {
  /**
   * Search singers with filters
   * @param params - Search parameters
   */
  searchSingers: async (params: SingerSearchParams = {}): Promise<SingerSearchResponse> => {
    const queryParams = new URLSearchParams();

    if (params.genre) queryParams.append('genre', params.genre);
    if (params.city) queryParams.append('city', params.city);
    if (params.address) queryParams.append('address', params.address);
    if (params.name) queryParams.append('name', params.name);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.highlight) queryParams.append('highlight', params.highlight);
    if (params.eventCategory) queryParams.append('eventCategory', params.eventCategory);

    const response = await axiosInstance.get<SingerSearchResponse>(
      `/singer?${queryParams.toString()}`
    );

    return response.data;
  },

  /**
   * Get featured singers for homepage
   * @param limit - Number of featured singers to fetch
   */
  getFeaturedSingers: async (limit: number = 10): Promise<SingerSearchResponse> => {
    return singerService.searchSingers({
      highlight: 'featured',
      limit,
      page: 1,
    });
  },

  /**
   * Get singer details by ID
   * @param userId - The user ID of the singer
   */
  getSingerById: async (userId: string): Promise<Singer | null> => {
    try {
      const response = await axiosInstance.get<{ singer: Singer; singerProfile: SingerProfile }>(
        `/singer/${userId}`
      );
      // Merge singerProfile into singer object
      return {
        ...response.data.singer,
        singerProfile: response.data.singerProfile,
      };
    } catch (error) {
      console.error('Failed to fetch singer by ID:', error);
      return null;
    }
  },

  /**
   * Add singer to wishlist
   * @param singerId - The ID of the singer to add to wishlist
   */
  addToWishlist: async (singerId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/singer/add-to-wishlist', {
      singerId,
    });
    return response.data;
  },

  /**
   * Get user's wishlist
   */
  getWishlist: async (): Promise<string[]> => {
    const response = await axiosInstance.get<{ message: string; wishlist: string[] }>('/singer/user/get-wishlist');
    return response.data.wishlist || [];
  },

  /**
   * Remove singer from wishlist
   * @param singerId - The ID of the singer to remove from wishlist
   */
  removeFromWishlist: async (singerId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete('/singer/remove-from-wishlist', {
      data: { singerId },
    });
    return response.data;
  },
};

export default singerService;
