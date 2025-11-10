import { Route, Routes } from "react-router";
import {
  Home,
  BookingSinger,
  SearchResults,
  SingerDetails,
  SingerProfile,
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
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/singer-profile" element={<SingerProfile />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/singers/:id" element={<SingerDetails />} />
      <Route path="/booking/singer/:id" element={<BookingSinger />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default AppRouter;
