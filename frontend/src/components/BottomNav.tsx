import { NavLink } from "react-router-dom"
import { FiHome, FiUser, FiLogOut } from "react-icons/fi"
import { MdFeedback } from "react-icons/md"
import { BiData } from "react-icons/bi"

export default function BottomNav() {
  const baseClass =
    "flex flex-col items-center text-xs transition cursor-pointer"

  const activeClass = "text-[#FD7979]"
  const inactiveClass = "text-gray-400 hover:text-[#FD7979]"

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

      <NavLink
        to="/login"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <FiLogOut size={20} />
        <span>LOG OUT</span>
      </NavLink>

    </div>
  )
}