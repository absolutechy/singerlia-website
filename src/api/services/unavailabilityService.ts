import axiosInstance from '../axiosInstance';

export interface TimeSlot {
  id: string;
  label: string;
  start: string;
  end: string;
}

export interface UnavailabilityRecord {
  date: string; // YYYY-MM-DD format
  timeSlot: 'morning' | 'afternoon' | 'evening';
  markedAt: string; // ISO timestamp
}

export interface TimeSlots {
  MORNING: TimeSlot;
  AFTERNOON: TimeSlot;
  EVENING: TimeSlot;
}

export interface SingerUnavailabilityResponse {
  message: string;
  singerId: string;
  unavailability: UnavailabilityRecord[];
  timeSlots: TimeSlots;
}

const unavailabilityService = {
  /**
   * Get singer's unavailability (public endpoint)
   * @param singerId - The singer's user ID
   */
  getSingerUnavailability: async (singerId: string): Promise<SingerUnavailabilityResponse> => {
    try {
      const response = await axiosInstance.get<SingerUnavailabilityResponse>(
        `/singer/unavailability/${singerId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching singer unavailability:', error);
      throw error;
    }
  },

  /**
   * Check if a specific date and time slot is available
   * @param unavailability - Array of unavailability records
   * @param date - Date to check (YYYY-MM-DD)
   * @param timeSlot - Time slot to check
   */
  isSlotAvailable: (
    unavailability: UnavailabilityRecord[],
    date: string,
    timeSlot: 'morning' | 'afternoon' | 'evening'
  ): boolean => {
    return !unavailability.some(
      (record) => record.date === date && record.timeSlot === timeSlot
    );
  },

  /**
   * Check if a date has any unavailable slots
   * @param unavailability - Array of unavailability records
   * @param date - Date to check (YYYY-MM-DD)
   */
  isDateFullyBooked: (unavailability: UnavailabilityRecord[], date: string): boolean => {
    const slotsForDate = unavailability.filter((record) => record.date === date);
    // Date is fully booked if all 3 slots are unavailable
    return slotsForDate.length === 3;
  },

  /**
   * Get unavailable slots for a specific date
   * @param unavailability - Array of unavailability records
   * @param date - Date to check (YYYY-MM-DD)
   */
  getUnavailableSlots: (unavailability: UnavailabilityRecord[], date: string): string[] => {
    return unavailability
      .filter((record) => record.date === date)
      .map((record) => record.timeSlot);
  },
};

export default unavailabilityService;
