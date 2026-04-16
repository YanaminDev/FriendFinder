import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import PageWrapper from "../layout/PageWrapper"
import LoginPage from "../pages/LoginPage"
import HomePage from "../pages/HomePage"
import UserPage from "../pages/UserPage"
import FeedbackPage from "../pages/FeedbackPage"
import AddDataPage from "../pages/AddDataPage"
import RegisterPage from "../pages/RegisterPage"
import ForgotPasswordPage from "../pages/ForgotPasswordPage"
import { AdminRoute } from "../components/common/AdminRoute"

export default function Router() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <BrowserRouter>
        <Routes>
          <Route element={<PageWrapper />}>
            {/* Public routes */}
            <Route path="/" element={<LoginPage /> } />
            <Route path="/login" element={<LoginPage /> } />
            <Route path="/register" element={<RegisterPage /> } />
            <Route path="/forgot-password" element={<ForgotPasswordPage /> } />

            {/* Admin-only routes */}
            <Route path="/user" element={<AdminRoute><UserPage /></AdminRoute>} />
            <Route path="/feedback" element={<AdminRoute><FeedbackPage /></AdminRoute>} />
            <Route path="/adddata" element={<AdminRoute><AddDataPage /></AdminRoute>} />
            <Route path="/home" element={<AdminRoute><HomePage /></AdminRoute>} />

            <Route path="*" element={<div className="text-center p-10 font-black"> 404 Page not found</div>} />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}