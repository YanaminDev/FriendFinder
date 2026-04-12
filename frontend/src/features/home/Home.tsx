import BottomNav from "../../components/BottomNav"
import TopBar from "../../components/TopBar"
import LocationPicker, { type SelectedLocation } from "../map/PositionPicker"
import AddPositionModal from "../Position/AddPositionModal"
import EditPositionModal from "../Position/EditPositionModal"
import PositionDetailPopup from "../Position/PositionDetailPopup"
import PlaceListModal from "../location/PlaceListModal"
import PlaceFormModal from "../location/PlaceFormModal"
import { useState, useEffect } from "react"
import { positionService, locationService } from "../../services"
import type { LocationResponse } from "../../types/responses"

interface Position {
  id: string
  name: string
  information?: string
  phone?: string
  open_date?: string
  open_time?: string
  close_time?: string
  image?: string
  latitude: number
  longitude: number
}

export default function Home() {
  const [positions, setPositions] = useState<Position[]>([])
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)

  // Modal open states
  const [isAddPositionOpen, setIsAddPositionOpen] = useState(false)
  const [isEditPositionOpen, setIsEditPositionOpen] = useState(false)
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false)
  const [isPlaceListOpen, setIsPlaceListOpen] = useState(false)
  const [isPlaceFormOpen, setIsPlaceFormOpen] = useState(false)

  const [selectedPickerCoords, setSelectedPickerCoords] = useState<SelectedLocation | null>(null)
  const [editingPlace, setEditingPlace] = useState<LocationResponse | null>(null)
  const [placeListKey, setPlaceListKey] = useState(0)

  useEffect(() => {
    positionService.getAll()
      .then(data => setPositions(data))
      .catch(err => console.error('Failed to fetch positions:', err))
  }, [])

  // ========== Position (marker) handlers ==========

  const handleAddPositionClick = (coords: SelectedLocation) => {
    setSelectedPickerCoords(coords)
    setIsAddPositionOpen(true)
  }

  const handleMarkerClick = (position: Position) => {
    setSelectedPosition(position)
    setIsDetailPopupOpen(true)
  }

  const handleSavePosition = async (formData: {
    name: string
    information: string
    phone: string
    open_date: string
    open_time: string
    close_time: string
    latitude: number
    longitude: number
    images: File[]
  }) => {
    try {
      const newPosition = await positionService.create({
        name: formData.name,
        information: formData.information || undefined,
        phone: formData.phone || undefined,
        open_date: formData.open_date || undefined,
        open_time: formData.open_time || undefined,
        close_time: formData.close_time || undefined,
        latitude: formData.latitude,
        longitude: formData.longitude,
      })

      // Upload images if any
      if (formData.images.length > 0) {
        try {
          const updated = await positionService.uploadImages(newPosition.id, formData.images)
          setPositions(prev => [...prev, updated])
        } catch {
          // Position created but image upload failed
          setPositions(prev => [...prev, newPosition])
        }
      } else {
        setPositions(prev => [...prev, newPosition])
      }

      setIsAddPositionOpen(false)
    } catch (err) {
      console.error('Failed to create position:', err)
      alert('Failed to create position')
    }
  }

  const handleUpdatePosition = async (positionId: string, formData: {
    name: string
    information: string
    phone: string
    open_date: string
    open_time: string
    close_time: string
    latitude: number
    longitude: number
    images: File[]
  }) => {
    try {
      const updated = await positionService.update(positionId, {
        name: formData.name,
        information: formData.information || undefined,
        phone: formData.phone || undefined,
        open_date: formData.open_date || undefined,
        open_time: formData.open_time || undefined,
        close_time: formData.close_time || undefined,
        latitude: formData.latitude,
        longitude: formData.longitude,
      })

      // Upload new images if any
      if (formData.images.length > 0) {
        try {
          const withImages = await positionService.uploadImages(positionId, formData.images)
          setPositions(prev => prev.map(p => p.id === positionId ? withImages : p))
        } catch {
          setPositions(prev => prev.map(p => p.id === positionId ? updated : p))
        }
      } else {
        setPositions(prev => prev.map(p => p.id === positionId ? updated : p))
      }

      setIsEditPositionOpen(false)
    } catch (err) {
      console.error('Failed to update position:', err)
      alert('Failed to update position')
    }
  }

  const handleDeletePosition = async (positionId: string) => {
    if (!confirm('Are you sure you want to delete this position?')) return
    try {
      await positionService.delete(positionId)
      setPositions(prev => prev.filter(p => p.id !== positionId))
      setIsDetailPopupOpen(false)
      setIsEditPositionOpen(false)
    } catch (err) {
      console.error('Failed to delete position:', err)
    }
  }

  // ========== Detail popup actions ==========

  const handleEditLocation = (position: Position) => {
    setSelectedPosition(position)
    setIsDetailPopupOpen(false)
    setIsPlaceListOpen(true)
  }

  const handleEditPosition = (position: Position) => {
    setSelectedPosition(position)
    setIsDetailPopupOpen(false)
    setIsEditPositionOpen(true)
  }

  // ========== Place (Location) handlers ==========

  const handleOpenPlaceForm = () => {
    setEditingPlace(null)
    setIsPlaceFormOpen(true)
  }

  const handleEditPlaceItem = (location: LocationResponse) => {
    setEditingPlace(location)
    setIsPlaceFormOpen(true)
  }

  const handleDeletePlaceItem = async (locationId: string) => {
    if (!confirm('Are you sure you want to delete this place?')) return
    try {
      await locationService.delete(locationId)
      setPlaceListKey(prev => prev + 1)
    } catch (err) {
      console.error('Failed to delete place:', err)
    }
  }

  const handleSavePlace = async (formData: {
    name: string
    description: string
    phone: string
    activity_id: string
    open_date: string
    open_time: string
    close_time: string
    newImages: File[]
    removedImageIds: string[]
  }) => {
    if (!selectedPosition) return
    try {
      if (editingPlace) {
        await locationService.update(editingPlace.id, {
          description: formData.description || undefined,
          phone: formData.phone || undefined,
          open_date: formData.open_date || undefined,
          open_time: formData.open_time || undefined,
          close_time: formData.close_time || undefined,
        })
        // Delete removed images
        if (formData.removedImageIds.length > 0) {
          await Promise.allSettled(
            formData.removedImageIds.map(id =>
              locationService.deleteImage(id, editingPlace.id)
            )
          )
        }
        // Upload new images
        if (formData.newImages.length > 0) {
          await Promise.allSettled(
            formData.newImages.map(image =>
              locationService.uploadImage(editingPlace.id, image)
            )
          )
        }
      } else {
        const newLocation = await locationService.create({
          name: formData.name,
          description: formData.description || undefined,
          phone: formData.phone || undefined,
          activity_id: formData.activity_id,
          latitude: selectedPosition.latitude,
          longitude: selectedPosition.longitude,
          position_id: selectedPosition.id,
          open_date: formData.open_date || undefined,
          open_time: formData.open_time || undefined,
          close_time: formData.close_time || undefined,
        })
        // Upload new images
        if (formData.newImages.length > 0 && newLocation?.id) {
          await Promise.allSettled(
            formData.newImages.map(image =>
              locationService.uploadImage(newLocation.id, image)
            )
          )
        }
      }
      setIsPlaceFormOpen(false)
      setPlaceListKey(prev => prev + 1)
    } catch (err) {
      console.error('Failed to save place:', err)
      alert('Failed to save place')
    }
  }

  return (
    <div className="relative w-full h-screen flex flex-col">
      <TopBar />

      <div className="flex-1 pt-16 relative">
        <LocationPicker
          onAddPositionClick={handleAddPositionClick}
          locations={positions}
          onLocationClick={handleMarkerClick}
        />
      </div>

      {/* Add Position Modal */}
      <AddPositionModal
        isOpen={isAddPositionOpen}
        onClose={() => setIsAddPositionOpen(false)}
        onSave={handleSavePosition}
        initialCoords={selectedPickerCoords}
      />

      {/* Edit Position Modal */}
      <EditPositionModal
        isOpen={isEditPositionOpen}
        onClose={() => setIsEditPositionOpen(false)}
        onSave={handleUpdatePosition}
        onDelete={handleDeletePosition}
        location={selectedPosition}
      />

      {/* Position Detail Popup */}
      <PositionDetailPopup
        isOpen={isDetailPopupOpen}
        onClose={() => setIsDetailPopupOpen(false)}
        position={selectedPosition}
        onEditLocation={handleEditLocation}
        onEditPosition={handleEditPosition}
        onDelete={handleDeletePosition}
      />

      {/* Place List Modal */}
      <PlaceListModal
        key={placeListKey}
        isOpen={isPlaceListOpen}
        onClose={() => setIsPlaceListOpen(false)}
        positionId={selectedPosition?.id || null}
        positionName={selectedPosition?.name || ''}
        onAddPlace={handleOpenPlaceForm}
        onEditPlace={handleEditPlaceItem}
        onDeletePlace={handleDeletePlaceItem}
      />

      {/* Place Create/Edit Form */}
      <PlaceFormModal
        isOpen={isPlaceFormOpen}
        onClose={() => setIsPlaceFormOpen(false)}
        onSave={handleSavePlace}
        editingPlace={editingPlace}
      />

      <BottomNav />
    </div>
  )
}
