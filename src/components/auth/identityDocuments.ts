import { CreditCard, FileText, IdCard, type LucideIcon } from "lucide-react";

// Mirrors IDENTITY_CATEGORIES in the backend's services/singerProfile.js: each kind of singer
// proves identity with exactly one document.
export type IdentityCategory = "saudi_national" | "saudi_resident" | "visiting_performer";
export type DocumentType = "national_id" | "iqama" | "passport";

export const IDENTITY_CATEGORIES: IdentityCategory[] = [
  "saudi_national",
  "saudi_resident",
  "visiting_performer",
];

export const REQUIRED_DOCUMENT: Record<IdentityCategory, DocumentType> = {
  saudi_national: "national_id",
  saudi_resident: "iqama",
  visiting_performer: "passport",
};

export const DOCUMENT_TYPES: { type: DocumentType; icon: LucideIcon }[] = [
  { type: "national_id", icon: CreditCard },
  { type: "iqama", icon: IdCard },
  { type: "passport", icon: FileText },
];

export const isIdentityCategory = (value: unknown): value is IdentityCategory =>
  IDENTITY_CATEGORIES.includes(value as IdentityCategory);

export const isDocumentType = (value: unknown): value is DocumentType =>
  DOCUMENT_TYPES.some((doc) => doc.type === value);

// Client-side copy of the backend rules, so mistakes show up before submitting.
const IDENTITY_NUMBER_PATTERNS: Record<IdentityCategory, RegExp> = {
  saudi_national: /^1\d{9}$/,
  saudi_resident: /^2\d{9}$/,
  visiting_performer: /^[A-Z0-9]{5,20}$/,
};

export const normalizeIdentityNumber = (category: IdentityCategory | "", value: string) =>
  category === "visiting_performer"
    ? value.replace(/\s+/g, "").toUpperCase().slice(0, 20)
    : value.replace(/\D/g, "").slice(0, 10);

export const isValidIdentityNumber = (category: IdentityCategory, value: string) =>
  IDENTITY_NUMBER_PATTERNS[category].test(value);
