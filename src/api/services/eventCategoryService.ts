import axiosInstance from '../axiosInstance';

// The admin-managed master list of event categories singers price against.
export interface EventCategory {
  categoryId: string;
  label: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListEventCategoriesResponse {
  message: string;
  categories: EventCategory[];
}

const eventCategoryService = {
  /**
   * List active event categories.
   * GET /api/event-categories
   */
  getAllEventCategories: async (): Promise<ListEventCategoriesResponse> => {
    const response = await axiosInstance.get<ListEventCategoriesResponse>('/event-categories');
    return response.data;
  },
};

export default eventCategoryService;
