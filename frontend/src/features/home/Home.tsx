import BottomNav from "../../components/BottomNav"
import TopBar from "../../components/TopBar"
import LocationPicker, { type SelectedLocation } from "../map/LocationPicker"
import AddLocationModal from "../map/AddLocationModal"
import EditLocationModal from "../map/EditLocationModal"
import { useState } from "react"

interface Location {
  id: string
  name: string
  description?: string
  phone?: string
  activity_id?: string
  open_date?: string
  open_time?: string
  close_time?: string
  latitude: number
  longitude: number
}

const MOCK_LOCATIONS: Location[] = [
  {
    id: "loc-1",
    name: "Blue Sky Café",
    description: "Cozy café with great coffee and pastries",
    phone: "0812345678",
    activity_id: "1",
    open_date: "Mon-Fri",
    open_time: "08:00",
    close_time: "20:00",
    latitude: 13.7945,
    longitude: 100.3254,
  },
  {
    id: "loc-2",
    name: "Major Cineplex Ratchayothin",
    description: "Modern cinema with IMAX screens",
    phone: "0898765432",
    activity_id: "3",
    open_date: "Everyday",
    open_time: "10:00",
    close_time: "23:00",
    latitude: 13.8387,
    longitude: 100.5696,
  },
  {
    id: "loc-3",
    name: "Lumpini Park",
    description: "Large public park in central Bangkok, great for jogging",
    phone: "",
    activity_id: "5",
    open_date: "Everyday",
    open_time: "04:30",
    close_time: "21:00",
    latitude: 13.7318,
    longitude: 100.5415,
  },
  {
    id: "loc-4",
    name: "CentralWorld",
    description: "One of the largest shopping malls in Bangkok",
    phone: "0221001000",
    activity_id: "4",
    open_date: "Everyday",
    open_time: "10:00",
    close_time: "22:00",
    latitude: 13.7466,
    longitude: 100.5392,
  },
  {
    id: "loc-5",
    name: "Zen Studio Thonglor",
    description: "Yoga and wellness studio",
    phone: "0654321098",
    activity_id: "7",
    open_date: "Mon-Sat",
    open_time: "06:00",
    close_time: "21:00",
    latitude: 13.7326,
    longitude: 100.5845,
  },
]

export default function Home() {
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false)
  const [isEditLocationModalOpen, setIsEditLocationModalOpen] = useState(false)
  const [selectedPickerCoords, setSelectedPickerCoords] = useState<SelectedLocation | null>(null)
  const [selectedEditLocation, setSelectedEditLocation] = useState<Location | null>(null)
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS)

  const handleAddLocationClick = (coords: SelectedLocation) => {
    setSelectedPickerCoords(coords)
    setIsAddLocationModalOpen(true)
  }

  const handleEditLocationClick = (location: Location) => {
    setSelectedEditLocation(location)
    setIsEditLocationModalOpen(true)
  }

  const handleDeleteLocation = async (locationId: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return
    setLocations(prev => prev.filter(loc => loc.id !== locationId))
    setIsEditLocationModalOpen(false)
  }

  const handleSaveLocation = async (formData: {
    name: string
    description: string
    phone: string
    activity_id: string
    open_date: string
    open_time: string
    close_time: string
    latitude: number
    longitude: number
  }) => {
    const newLocation: Location = {
      id: `loc-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      phone: formData.phone,
      activity_id: formData.activity_id,
      open_date: formData.open_date,
      open_time: formData.open_time,
      close_time: formData.close_time,
      latitude: formData.latitude,
      longitude: formData.longitude,
    }
    setLocations(prev => [...prev, newLocation])
    setIsAddLocationModalOpen(false)
  }

  const handleUpdateLocation = async (locationId: string, formData: {
    name: string
    description: string
    phone: string
    activity_id: string
    open_date: string
    open_time: string
    close_time: string
    latitude: number
    longitude: number
  }) => {
    setLocations(prev => prev.map(loc =>
      loc.id === locationId
        ? { ...loc, ...formData }
        : loc
    ))
    setIsEditLocationModalOpen(false)
  }

  return (
    <div className="relative w-full h-screen flex flex-col">
      <TopBar />
      
      {/* Main Location Picker */}
      <div className="flex-1 pt-16 relative">
        <LocationPicker 
          onAddLocationClick={handleAddLocationClick}
          locations={locations}
          onLocationClick={handleEditLocationClick}
        />
      </div>

      {/* Add Location Modal */}
      <AddLocationModal
        isOpen={isAddLocationModalOpen}
        onClose={() => setIsAddLocationModalOpen(false)}
        onSave={handleSaveLocation}
        initialCoords={selectedPickerCoords}
      />

      {/* Edit Location Modal */}
      <EditLocationModal
        isOpen={isEditLocationModalOpen}
        onClose={() => setIsEditLocationModalOpen(false)}
        onSave={handleUpdateLocation}
        onDelete={handleDeleteLocation}
        location={selectedEditLocation}
      />
        
      <BottomNav />
    </div>
  )
}
