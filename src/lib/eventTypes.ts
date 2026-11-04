import type { EventCategory } from "@/api/services/eventCategoryService";
import type { CategoryPricing } from "@/api/services/singerService";

export interface OfferedEventType {
  categoryId: string;
  label: string;
  price: number;
}

// The event types a singer can be booked for: admin-managed categories they have priced, plus any
// "Other" types they added themselves (stored in categoryPricing with custom: true and their own
// label — see the backend's updateSingerCategoryPricingHandler).
export const getOfferedEventTypes = (
  eventCategories: EventCategory[],
  categoryPricing: CategoryPricing | undefined
): OfferedEventType[] => {
  const pricing = categoryPricing || {};
  const adminTypes = eventCategories
    .filter((category) => Number(pricing[category.categoryId]?.price) > 0)
    .map((category) => ({
      categoryId: category.categoryId,
      label: category.label,
      price: Number(pricing[category.categoryId].price),
    }));
  const customTypes = Object.entries(pricing)
    .filter(([, entry]) => entry.custom && Number(entry.price) > 0)
    .map(([categoryId, entry]) => ({
      categoryId,
      label: entry.label || categoryId,
      price: Number(entry.price),
    }));
  return [...adminTypes, ...customTypes];
};
