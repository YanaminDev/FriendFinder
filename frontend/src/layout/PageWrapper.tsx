import { Outlet, useLocation } from "react-router-dom"

export default function PageWrapper() {
  const location = useLocation()

  return (
    <div key={location.pathname} className="animate-fadeIn">
      <Outlet />
    </div>
  )
}