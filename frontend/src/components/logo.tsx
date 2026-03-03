export default function Logo() {
  return (
    <div className="relative transition-all duration-500 hover:scale-110 cursor-pointer flex flex-col items-center">

      {/* Glow Background */}
      <div className=""></div>

      <div className="flex w-[80px] md:w-[120px]">
        <img
          src="/LOGOFreindfinder.svg"
          alt="FriendFinder Logo"
          className="object-contain"
        />
      </div>

      <h1 className="text-[20px] md:text-[25px] font-bold text-[#FD7979] text-center mt-2">
        FriendFinder
      </h1>
    </div>
  )
}