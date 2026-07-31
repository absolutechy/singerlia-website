import axiosInstance from "@/api/axiosInstance";

export interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    address?: string;
    topic: "booking" | "support" | "signup" | "partnership" | "other";
    message: string;
}

const contactFormService = {
    submitContactForm: async (formData: ContactFormData) => {
        const response = await axiosInstance.post("/contact/submit-contact-form", formData);
        return response.data;
    }
}

export default contactFormService;