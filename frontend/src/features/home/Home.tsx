import BottomNav from "../../components/BottomNav"
import TopBar from "../../components/TopBar"
import LocationPicker, { type SelectedLocation } from "../map/PositionPicker"
import AddPositionModal from "../Position/AddPositionModal"
import EditPositionModal from "../Position/EditPositionModal"
import PositionDetailPopup from "../Position/PositionDetailPopup"
import PositionListPanel from "../Position/PositionListPanel"
import PlaceListModal from "../location/PlaceListModal"
import PlaceFormModal from "../location/PlaceFormModal"
import { useState, useEffect } from "react"
import { positionService, locationService } from "../../services"
import ConfirmDialog from "../../components/ConfirmDialog"
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
  isHidden?: boolean
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
  const [isPositionListPanelOpen, setIsPositionListPanelOpen] = useState(false)

  const [selectedPickerCoords, setSelectedPickerCoords] = useState<SelectedLocation | null>(null)
  const [editingPlace, setEditingPlace] = useState<LocationResponse | null>(null)
  const [placeListKey, setPlaceListKey] = useState(0)

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmLabel: string
    confirmVariant: 'danger' | 'primary' | 'admin'
    onConfirm: () => void
  }>({ isOpen: false, title: '', message: '', confirmLabel: '', confirmVariant: 'danger', onConfirm: () => {} })

  const openConfirm = (title: string, message: string, confirmLabel: string, onConfirm: () => void, confirmVariant: 'danger' | 'primary' | 'admin' = 'danger') => {
    setConfirmDialog({ isOpen: true, title, message, confirmLabel, confirmVariant, onConfirm })
  }

  const closeConfirm = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }))
  }

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
      openConfirm('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างตำแหน่งได้ กรุณาลองใหม่อีกครั้ง', 'ตกลง', closeConfirm)
    }
  }

  const handleUpdatePosition = (positionId: string, formData: {
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
    openConfirm(
      'อัปเดตตำแหน่ง',
      'คุณต้องการบันทึกการแก้ไขตำแหน่งนี้ใช่หรือไม่?',
      'ยืนยันบันทึก',
      async () => {
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
        }
        closeConfirm()
      }
    , 'primary'
    )
  }

  const handleDeletePosition = (positionId: string) => {
    openConfirm(
      'ลบตำแหน่ง',
      'คุณต้องการลบตำแหน่งนี้ใช่หรือไม่?',
      'ยืนยันลบ',
      async () => {
        try {
          await positionService.delete(positionId)
          setPositions(prev => prev.filter(p => p.id !== positionId))
          setIsDetailPopupOpen(false)
          setIsEditPositionOpen(false)
        } catch (err) {
          console.error('Failed to delete position:', err)
        }
        closeConfirm()
      }
    )
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

  const handleToggleHide = (positionId: string, isCurrentlyHidden: boolean) => {
    const action = isCurrentlyHidden ? 'แสดง' : 'ซ่อน'
    openConfirm(
      `${action}ตำแหน่ง`,
      `คุณต้องการ${action}ตำแหน่งนี้ใช่หรือไม่?`,
      `ยืนยัน${action}`,
      async () => {
        try {
          const updated = isCurrentlyHidden
            ? await positionService.unhide(positionId)
            : await positionService.hide(positionId)
          setPositions(prev => prev.map(p => p.id === positionId ? { ...p, isHidden: updated.isHidden } : p))
          setSelectedPosition(prev => prev && prev.id === positionId ? { ...prev, isHidden: updated.isHidden } : prev)
        } catch (err) {
          console.error(`Failed to ${action} position:`, err)
        }
        closeConfirm()
      },
      'primary'
    )
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

  const handleDeletePlaceItem = (locationId: string) => {
    openConfirm(
      'ลบสถานที่',
      'คุณต้องการลบสถานที่นี้ใช่หรือไม่?',
      'ยืนยันลบ',
      async () => {
        try {
          await locationService.delete(locationId)
          setPlaceListKey(prev => prev + 1)
        } catch (err) {
          console.error('Failed to delete place:', err)
        }
        closeConfirm()
      }
    )
  }

  const handleSavePlace = (formData: {
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

    const doSave = async () => {
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
        openConfirm('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกสถานที่ได้ กรุณาลองใหม่อีกครั้ง', 'ตกลง', closeConfirm)
      }
      closeConfirm()
    }

    if (editingPlace) {
      openConfirm(
        'อัปเดตสถานที่',
        'คุณต้องการบันทึกการแก้ไขสถานที่นี้ใช่หรือไม่?',
        'ยืนยันบันทึก',
        doSave,
        'primary'
      )
    } else {
      doSave()
    }
  }

  const handleSelectPositionFromPanel = (position: Position) => {
    setSelectedPosition(position)
    setIsPlaceListOpen(true)
  }

  return (
    <div className="relative w-full h-screen flex flex-col">
      <TopBar />

      {/* Floating Position List Button */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => setIsPositionListPanelOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-550 bg-white text-gray-500 hover:bg-gray-50 hover:text-[#F26B6B] hover:border-[#F26B6B] shadow-md transition-all text-sm font-medium"
        >
          <span>Position</span>
        </button>
      </div>

      <PositionListPanel
        isOpen={isPositionListPanelOpen}
        onClose={() => setIsPositionListPanelOpen(false)}
        onSelectPosition={handleSelectPositionFromPanel}
        onPositionVisibilityChange={(positionId, isHidden) => {
          setPositions(prev => prev.map(p => p.id === positionId ? { ...p, isHidden } : p))
        }}
      />

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
        onToggleHide={handleToggleHide}
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

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirm}
      />

      <BottomNav />
    </div>
  )
}
