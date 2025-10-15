import Home from "@/pages/Home"
import CreateAccountWelcome from "@/pages/auth/CreateAccountWelcome"
import ChooseRole from "@/pages/auth/ChooseRole"
import Login from "@/pages/auth/Login"
import Signup from "@/pages/auth/Signup"
import SelectVerification from "@/pages/auth/SelectVerification"
import VerificationCode from "@/pages/auth/VerificationCode"
import { Route, Routes } from "react-router"

const AppRouter = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/create-account" element={<CreateAccountWelcome />} />
        <Route path="/auth/choose-role" element={<ChooseRole />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/verification-method" element={<SelectVerification />} />
        <Route path="/auth/verification-code" element={<VerificationCode />} />
      </Routes>
  )
}

export default AppRouter
