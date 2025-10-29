import Home from "@/pages/Home"
import CreateAccountWelcome from "@/pages/auth/CreateAccountWelcome"
import ChooseRole from "@/pages/auth/ChooseRole"
import Login from "@/pages/auth/Login"
import Signup from "@/pages/auth/Signup"
import SelectVerification from "@/pages/auth/SelectVerification"
import SingerSignup from "@/pages/auth/SingerSignup"
import VerificationCode from "@/pages/auth/VerificationCode"
import ForgotPassword from "@/pages/auth/ForgotPassword"
import ResetPassword from "@/pages/auth/ResetPassword"
import { Route, Routes } from "react-router"
import SingerProfile from "@/pages/SingerProfile"
import SearchResults from "@/pages/SearchResults"
import SingerDetails from "@/pages/SingerDetails"
import BookingSinger from "@/pages/BookingSinger"

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
      </Routes>
  )
}

export default AppRouter
