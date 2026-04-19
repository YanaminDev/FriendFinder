import { NavLink, useNavigate } from "react-router-dom"
import { FiHome, FiUser, FiLogOut } from "react-icons/fi"
import { MdFeedback } from "react-icons/md"
import { BiData } from "react-icons/bi"
import { useAuth } from "../../hooks"

export default function BottomNav() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const baseClass =
    "flex flex-col items-center text-xs transition cursor-pointer"

  const activeClass = "text-[#FD7979]"
  const inactiveClass = "text-gray-400 hover:text-[#FD7979]"

  const handleLogout = async () => {
    console.log(' Logout button clicked')
    try {
      await logout()
      console.log(' Logout completed, navigating to login...')
      navigate('/login')
    } catch (err) {
      console.error(' Logout failed:', err)
      // Still navigate to login even if logout API fails
      navigate('/login')
    }
  }

  return (
    <div className="
      fixed bottom-0 left-0 
      w-full h-16 
      bg-white border-t
      flex justify-around items-center
      z-50
    ">

      <NavLink
        to="/home"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <FiHome size={20} />
        <span>HOME</span>
      </NavLink>

      <NavLink
        to="/user"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <FiUser size={20} />
        <span>USER</span>
      </NavLink>

      <NavLink
        to="/feedback"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <MdFeedback size={20} />
        <span>FEEDBACK</span>
      </NavLink>

      <NavLink
        to="/adddata"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <BiData size={20} />
        <span>ADD DATA</span>
      </NavLink>

      <button
        onClick={handleLogout}
        className={`${baseClass} ${inactiveClass}`}
      >
        <FiLogOut size={20} />
        <span>LOG OUT</span>
      </button>

    </div>
  )
}