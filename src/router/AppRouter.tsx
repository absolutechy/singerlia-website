import { Route, Routes } from "react-router";
import {
  Home,
  BookingSinger,
  BookingSuccess,
  PaymentResult,
  SearchResults,
  SingerDetails,
  SingerProfile,
  TermsAndConditions,
  PrivacyPolicy,
} from "@/pages";
import {
  CreateAccountWelcome,
  ChooseRole,
  Login,
  Signup,
  SingerSignup,
  VerificationCode,
  ForgotPassword,
  ResetPassword,
  SelectVerification,
  DocumentTypeSelection,
  DocumentUpload,
  DocumentReuploadTypeSelection,
  DocumentReupload,
  VerificationPending,
} from "@/pages/auth";
import Contact from "@/pages/Contact";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/create-account" element={<CreateAccountWelcome />} />
      <Route path="/auth/choose-role" element={<ChooseRole />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/singer-signup" element={<SingerSignup />} />
      <Route path="/auth/verification-method" element={<SelectVerification />} />
      <Route path="/auth/verification-code" element={<VerificationCode />} />
      <Route path="/auth/select-document-type" element={<DocumentTypeSelection />} />
      <Route path="/auth/upload-document" element={<DocumentUpload />} />
      <Route path="/singer/reupload-document-type" element={<DocumentReuploadTypeSelection />} />
      <Route path="/singer/reupload-verification" element={<DocumentReupload />} />
      <Route path="/auth/verification-pending" element={<VerificationPending />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/singer-profile" element={<SingerProfile />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/singers/:id" element={<SingerDetails />} />
      <Route path="/booking/singer/:id" element={<BookingSinger />} />
      <Route path="/booking/success" element={<BookingSuccess />} />
      <Route path="/payment/result" element={<PaymentResult />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    </Routes>
  );
};

export default AppRouter;
