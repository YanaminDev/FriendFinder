import { BrowserRouter, Routes, Route } from "react-router-dom"
import PageWrapper from "../layout/PageWrapper"
import LoginPage from "../pages/LoginPage"
import HomePage from "../pages/HomePage"
import UserPage from "../pages/UserPage"
import FeedbackPage from "../pages/FeedbackPage"
import AddDataPage from "../pages/AddDataPage"
import RegisterPage from "../pages/RegisterPage"
import ForgotPasswordPage from "../pages/ForgotPasswordPage"
import { ProtectedRoute } from "../components/common/ProtectedRoute"

export default function Router() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<PageWrapper />}>
            {/* Public routes */}
            <Route path="/" element={<LoginPage /> } />
            <Route path="/login" element={<LoginPage /> } />
            <Route path="/register" element={<RegisterPage /> } />
            <Route path="/forgot-password" element={<ForgotPasswordPage /> } />

            {/* Protected routes */}
            <Route path="/user" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
            <Route path="/adddata" element={<ProtectedRoute><AddDataPage /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

            <Route path="*" element={<div className="text-center p-10 font-black"> 404 Page not found</div>} />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}