export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-pink-100">

      {/* Center Content */}
      <div className="flex flex-1 items-center justify-center">
        {children}
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 pb-4">
        © {new Date().getFullYear()} FriendFinder. All rights reserved.
      </footer>

    </div>
  )
}