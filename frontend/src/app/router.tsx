import { BrowserRouter, Routes, Route } from "react-router-dom"
import PageWrapper from "../layout/PageWrapper"
import LoginPage from "../pages/LoginPage"
import HomePage from "../pages/HomePage"
import UserPage from "../pages/UserPage"
import FeedbackPage from "../pages/FeedbackPage"
import AddDataPage from "../pages/AddDataPage"
import { AdminRoute } from "../components/common/AdminRoute"

export default function Router() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<PageWrapper />}>
            {/* Public routes */}
            <Route path="/" element={<LoginPage /> } />
            <Route path="/login" element={<LoginPage /> } />

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