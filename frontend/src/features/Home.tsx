import BottomNav from "../components/BottomNav"
import TopBar from "../components/TopBar"
import Button from "../components/Button"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <TopBar />
        {/* Map Area */}
      
      <div className="pt-16 pb-16 h-screen">
        {/* ตรงนี้คือ Map ของท่าน */}
      </div>
      {/* Floating Button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <Button size="sm" >
          ADD LOCATION
        </Button>
      </div>
        
      <BottomNav />

    </div>
  )
}