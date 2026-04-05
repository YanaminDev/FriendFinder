import { BrowserRouter, Routes, Route } from "react-router-dom"
import PageWrapper from "../layout/PageWrapper"
import LoginPage from "../pages/LoginPage"
import HomePage from "../pages/HomePage"
import UserPage from "../pages/UserPage"
import FeedbackPage from "../pages/FeedbackPage"
import AddDataPage from "../pages/AddDataPage"
import RegisterPage from "../pages/RegisterPage"
import ForgotPasswordPage from "../pages/ForgotPasswordPage"

export default function Router() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<PageWrapper />}>
            <Route path="/" element={<LoginPage /> } />
            <Route path="/login" element={<LoginPage /> } />
            <Route path="/register" element={<RegisterPage /> } />
            <Route path="/forgot-password" element={<ForgotPasswordPage /> } />
            <Route path="/user" element={<UserPage /> } />
            <Route path="/feedback" element={<FeedbackPage /> } />
            <Route path="/adddata" element={<AddDataPage /> } />
            <Route path="/home" element={<HomePage />} />
            <Route path="*" element={<div className="text-center p-10 font-black"> 404 Page not found</div>} />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}