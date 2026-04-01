import BottomNav from "../../components/BottomNav"
import TopBar from "../../components/TopBar"
import Button from "../../components/Button"
import MapView, { type LocationData } from "../map/MapView"
import LocationDetail from "../map/LocationDetail"
import { useState } from "react"

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [isLocationDetailOpen, setIsLocationDetailOpen] = useState(false)

  const handleLocationClick = (location: LocationData) => {
    setSelectedLocation(location)
    setIsLocationDetailOpen(true)
  }

  const handleAddLocationClick = () => {
    setSelectedLocation(null)
    setIsLocationDetailOpen(true)
  }

  const handleCloseLocationDetail = () => {
    setIsLocationDetailOpen(false)
    setTimeout(() => setSelectedLocation(null), 300) // Wait for animation
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      <TopBar />
        {/* Map Area */}
      
      <div className="pt-16 pb-16 h-screen">
        <MapView className="w-full h-full" onLocationClick={handleLocationClick} />
      </div>
      {/* Floating Button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
        <Button size="sm" onClick={handleAddLocationClick}>
          ADD LOCATION
        </Button>
      </div>

      {/* Location Detail Modal */}
      <LocationDetail
        location={selectedLocation}
        isOpen={isLocationDetailOpen}
        onClose={handleCloseLocationDetail}
      />
        
      <BottomNav />

    </div>
  )
}
