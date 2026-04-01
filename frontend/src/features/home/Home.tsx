import BottomNav from "../../components/BottomNav"
import TopBar from "../../components/TopBar"
import LocationPicker, { type SelectedLocation } from "../map/LocationPicker"
import AddLocationModal from "../map/AddLocationModal"
import LocationMarkers from "../map/LocationMarkers"
import { useState, useRef } from "react"
import mapboxgl from "mapbox-gl"

interface Location {
  id: string
  name: string
  description?: string
  phone?: string
  activityId?: string
  openDate?: string
  openTime?: string
  closeTime?: string
  lat: number
  lng: number
}

export default function Home() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false)
  const [selectedPickerCoords, setSelectedPickerCoords] = useState<SelectedLocation | null>(null)
  const [locations, setLocations] = useState<Location[]>([])

  const handleMapReady = (map: mapboxgl.Map) => {
    mapRef.current = map
  }

  const handleAddLocationClick = (coords: SelectedLocation) => {
    setSelectedPickerCoords(coords)
    setIsAddLocationModalOpen(true)
  }

  const handleSaveLocation = (formData: {
    name: string
    description: string
    phone: string
    activityId: string
    openDate: string
    openTime: string
    closeTime: string
    lat: number
    lng: number
  }) => {
    const newLocation: Location = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      phone: formData.phone,
      activityId: formData.activityId,
      openDate: formData.openDate,
      openTime: formData.openTime,
      closeTime: formData.closeTime,
      lat: formData.lat,
      lng: formData.lng,
    }
    
    setLocations(prev => [...prev, newLocation])
    setIsAddLocationModalOpen(false)
    console.log('Location saved:', newLocation)
  }

  return (
    <div className="relative w-full h-screen flex flex-col">
      <TopBar />
      
      {/* Main Location Picker */}
      <div className="flex-1 pt-16 relative">
        <LocationPicker 
          onAddLocationClick={handleAddLocationClick}
          onMapReady={handleMapReady}
        />
        
        {/* Saved Locations Counter */}
        {locations.length > 0 && (
          <div className="absolute top-20 right-6 z-30 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
            {locations.length}
          </div>
        )}
        
        {/* Display location markers - always render, checks map.current internally */}
        <LocationMarkers map={mapRef} locations={locations} />
      </div>

      {/* Add Location Modal */}
      <AddLocationModal
        isOpen={isAddLocationModalOpen}
        onClose={() => setIsAddLocationModalOpen(false)}
        onSave={handleSaveLocation}
        initialCoords={selectedPickerCoords}
      />
        
      <BottomNav />
    </div>
  )
}
