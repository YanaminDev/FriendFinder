import BottomNav from "../../components/BottomNav"
import TopBar from "../../components/TopBar"
import LocationPicker, { type SelectedLocation } from "../map/LocationPicker"
import AddLocationModal from "../map/AddLocationModal"
import { useState, useEffect } from "react"

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
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false)
  const [selectedPickerCoords, setSelectedPickerCoords] = useState<SelectedLocation | null>(null)
  const [locations, setLocations] = useState<Location[]>([])

  // Fetch saved locations from backend on mount
  useEffect(() => {
    fetch('http://localhost:3000/v1/location/get', { credentials: 'include' })
      .then(res => res.json())
      .then((data: Array<{
        id: string;
        name: string;
        description?: string;
        phone?: string;
        activity_id?: string;
        open_date?: string;
        open_time?: string;
        close_time?: string;
        position?: { latitude: number; longitude: number };
      }>) => {
        const mapped: Location[] = data
          .filter(item => item.position)
          .map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            phone: item.phone,
            activityId: item.activity_id,
            openDate: item.open_date,
            openTime: item.open_time,
            closeTime: item.close_time,
            lat: item.position!.latitude,
            lng: item.position!.longitude,
          }))
        setLocations(mapped)
      })
      .catch(err => console.error('Failed to fetch locations:', err))
  }, [])

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
          locations={locations}
        />
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
