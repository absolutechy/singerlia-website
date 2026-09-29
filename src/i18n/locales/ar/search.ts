import type en from "../en/search";

const search = {
  "search.placeholder": "اختر الفنان أو نوع المناسبة أو نوع الفنان",
  "search.eventDate": "تاريخ المناسبة",
  "searchResults.heading": "{count}+ مساحة فنان بالقرب من {location}",
  "searchResults.you": "موقعك",
} as const satisfies Record<keyof typeof en, string>;

export default search;
