import BottomNav from "../../components/BottomNav"
import TopBar from "../../components/TopBar"
import LocationPicker, { type SelectedLocation } from "../map/LocationPicker"
import AddLocationModal from "../map/AddLocationModal"
import EditLocationModal from "../map/EditLocationModal"
import { useState, useEffect } from "react"

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

export default function Home() {
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false)
  const [isEditLocationModalOpen, setIsEditLocationModalOpen] = useState(false)
  const [selectedPickerCoords, setSelectedPickerCoords] = useState<SelectedLocation | null>(null)
  const [selectedEditLocation, setSelectedEditLocation] = useState<Location | null>(null)
  const [locations, setLocations] = useState<Location[]>([])

  // Fetch saved locations from backend on mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/location/get`, { credentials: 'include' })
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
            activity_id: item.activity_id,
            open_date: item.open_date,
            open_time: item.open_time,
            close_time: item.close_time,
            latitude: item.position!.latitude,
            longitude: item.position!.longitude,
          }))
        setLocations(mapped)
      })
      .catch(err => console.error('Failed to fetch locations:', err))
  }, [])

  const handleAddLocationClick = (coords: SelectedLocation) => {
    setSelectedPickerCoords(coords)
    setIsAddLocationModalOpen(true)
  }

  const handleEditLocationClick = (location: Location) => {
    setSelectedEditLocation(location)
    setIsEditLocationModalOpen(true)
  }

  const handleDeleteLocation = async (locationId: string) => {
    if (!confirm('Are you sure you want to delete this location?')) {
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/location/delete/${locationId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete location')
      }

      setLocations(prev => prev.filter(loc => loc.id !== locationId))
      alert('Location deleted successfully!')
    } catch (err) {
      console.error('Failed to delete location:', err)
      alert('Failed to delete location')
    }
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
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/location/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || undefined,
          phone: formData.phone || undefined,
          activity_id: formData.activity_id,
          latitude: formData.latitude,
          longitude: formData.longitude,
          open_date: formData.open_date || undefined,
          open_time: formData.open_time || undefined,
          close_time: formData.close_time || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save location')
      }

      const newLocation: Location = {
        id: Date.now().toString(),
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
      alert('Location saved successfully!')
    } catch (err) {
      console.error('Failed to save location:', err)
      alert('Failed to save location')
    }
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
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/location/update/${locationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          description: formData.description || undefined,
          phone: formData.phone || undefined,
          open_date: formData.open_date || undefined,
          open_time: formData.open_time || undefined,
          close_time: formData.close_time || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update location')
      }

      setLocations(prev => prev.map(loc => 
        loc.id === locationId 
          ? {
              ...loc,
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
          : loc
      ))
      setIsEditLocationModalOpen(false)
      alert('Location updated successfully!')
    } catch (err) {
      console.error('Failed to update location:', err)
      alert('Failed to update location')
    }
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
