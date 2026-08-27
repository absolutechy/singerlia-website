// Singerlia operates exclusively in Saudi Arabia — every "city" selector across the site
// (singer signup, search filters, etc.) should draw from this single list so a singer's
// registered city always matches what customers can filter/search by.
//
// `value` is the lowercase slug stored on the user record (see SingerSignup.tsx) and used
// for filtering/matching; `label` is the display text.
export const SAUDI_CITIES: { value: string; label: string }[] = [
  { value: "riyadh", label: "Riyadh" },
  { value: "jeddah", label: "Jeddah" },
  { value: "mecca", label: "Mecca" },
  { value: "medina", label: "Medina" },
  { value: "dammam", label: "Dammam" },
  { value: "khobar", label: "Khobar" },
  { value: "dhahran", label: "Dhahran" },
  { value: "taif", label: "Taif" },
  { value: "buraidah", label: "Buraidah" },
  { value: "tabuk", label: "Tabuk" },
  { value: "khamis-mushait", label: "Khamis Mushait" },
  { value: "hail", label: "Hail" },
  { value: "najran", label: "Najran" },
  { value: "jubail", label: "Jubail" },
  { value: "abha", label: "Abha" },
  { value: "yanbu", label: "Yanbu" },
  { value: "al-qatif", label: "Al Qatif" },
  { value: "al-mubarraz", label: "Al Mubarraz" },
  { value: "al-ahsa", label: "Al Ahsa" },
];
