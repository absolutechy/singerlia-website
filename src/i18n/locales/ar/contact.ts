import type en from "../en/contact";

const contact = {
  "contact.title": "اتصل بنا",
  "contact.subtitle": "تحتاج مساعدة؟ لديك أي أسئلة؟ املأ النموذج وسيتواصل معك فريقنا قريباً.",
  "contact.topicLabel": "كيف يمكننا مساعدتك*",
  "contact.selectOption": "اختر خياراً",
  "contact.topic.booking": "مساعدة في الحجز",
  "contact.topic.support": "دعم المنصة",
  "contact.topic.signup": "دعم إنشاء الحساب",
  "contact.topic.partnership": "استفسار شراكة",
  "contact.topic.other": "أخرى",
  "contact.firstName": "الاسم الأول",
  "contact.lastName": "اسم العائلة",
  "contact.email": "البريد الإلكتروني",
  "contact.phone": "رقم الهاتف",
  "contact.company": "اسم الشركة",
  "contact.address": "عنوان المكتب",
  "contact.message": "الرسالة",
  "contact.messagePlaceholder": "اكتب رسالتك...",
  "contact.sending": "جار الإرسال...",
  "contact.sent": "تم إرسال الرسالة! سيتواصل معك فريقنا قريباً.",
  "contact.failed": "تعذر إرسال رسالتك. يرجى المحاولة مرة أخرى.",
} as const satisfies Record<keyof typeof en, string>;

export default contact;
