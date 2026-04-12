import { useState } from 'react'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import ConfirmDialog from './ConfirmDialog'
import IconPicker from './IconPicker'
import { IoniconRender } from '../utils/ionicon'

interface Option {
  id: string
  name: string
  icon?: string
}

interface CategoryCardProps {
  id?: string
  icon?: string
  title?: string
  options?: Option[]
  isCreating?: boolean
  enableIconPicker?: boolean
  onAddOption?: (categoryId: string, newName: string, icon?: string) => void
  onEditOption?: (categoryId: string, optionId: string, newName: string, icon?: string) => void
  onDeleteOption?: (categoryId: string, optionId: string) => void
  onDeleteCategory?: (categoryId: string) => void
  onSaveCategory?: (name: string, icon: string, options: Option[]) => void
  onCancel?: () => void
}

export default function CategoryCard({
  id = '',
  icon = '',
  title = '',
  options = [],
  isCreating = false,
  enableIconPicker = false,
  onAddOption,
  onEditOption,
  onDeleteOption,
  onDeleteCategory,
  onSaveCategory,
  onCancel,
}: CategoryCardProps) {
  const [formIcon, setFormIcon] = useState(icon)
  const [formTitle, setFormTitle] = useState(title)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newOptionName, setNewOptionName] = useState('')
  const [newOptionIcon, setNewOptionIcon] = useState('star-outline')
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null)
  const [editingOptionValue, setEditingOptionValue] = useState('')
  const [editingOptionIcon, setEditingOptionIcon] = useState('')
  const [draftOptions, setDraftOptions] = useState<Option[]>([])
  const [deleteTarget, setDeleteTarget] = useState<{ optionId: string; optionName: string } | null>(null)
  const [showValidation, setShowValidation] = useState(false)
  const [iconPickerTarget, setIconPickerTarget] = useState<'add' | 'edit' | null>(null)
  const handleSaveNewOption = () => {
    if (!newOptionName.trim()) return
    if (isCreating) {
      setDraftOptions([...draftOptions, { id: `draft-${Date.now()}`, name: newOptionName, icon: enableIconPicker ? newOptionIcon : undefined }])
    } else {
      onAddOption?.(id, newOptionName, enableIconPicker ? newOptionIcon : undefined)
    }
    setNewOptionName('')
    setNewOptionIcon('star-outline')
    setIsAddingNew(false)
  }

  const handleSaveEdit = (optionId: string) => {
    if (!editingOptionValue.trim()) return
    if (isCreating) {
      setDraftOptions(draftOptions.map(o => o.id === optionId ? { ...o, name: editingOptionValue, icon: enableIconPicker ? editingOptionIcon : o.icon } : o))
    } else {
      onEditOption?.(id, optionId, editingOptionValue, enableIconPicker ? editingOptionIcon : undefined)
    }
    setEditingOptionId(null)
  }

  const handleDeleteDraft = (optionId: string) => {
    setDraftOptions(draftOptions.filter(o => o.id !== optionId))
  }

  const handleSaveCategory = () => {
    if (!formTitle.trim()) {
      setShowValidation(true)
      return
    }
    onSaveCategory?.(formTitle, formIcon, draftOptions)
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] mb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FD7979] to-[#ff9a9a] px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isCreating ? (
              <input
                type="text"
                maxLength={2}
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
                className="w-9 h-9 text-center text-xl bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm"
                placeholder="🏷️"
              />
            ) : (
              <span className="text-xl">{icon}</span>
            )}
            {isCreating ? (
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Category Name"
                autoFocus
                className="text-base font-bold text-white bg-white/20 rounded-lg border border-white/30 px-3 py-1 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm"
              />
            ) : (
              <h3 className="text-base font-bold text-white">{title}</h3>
            )}
          </div>

          {isCreating ? (
            <div className="flex gap-2">
              <button onClick={onCancel} className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/30 transition">
                Cancel
              </button>
              <button onClick={handleSaveCategory} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#FD7979] hover:bg-white/90 transition">
                Save
              </button>
            </div>
          ) : onDeleteCategory ? (
            <button onClick={() => onDeleteCategory?.(id)} className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/30 transition">
              Delete
            </button>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">

      {/* Options */}
      <div className="space-y-2 mb-4">
        {(isCreating ? draftOptions : options).map((option) => (
          <div key={option.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
            {editingOptionId === option.id ? (
              <>
                {enableIconPicker && (
                  <button
                    onClick={() => setIconPickerTarget('edit')}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-red-50 transition"
                    title="เปลี่ยน icon"
                  >
                    <IoniconRender name={editingOptionIcon} size={18} className="text-gray-700" />
                  </button>
                )}
                <input
                  autoFocus
                  value={editingOptionValue}
                  onChange={(e) => setEditingOptionValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(option.id); if (e.key === 'Escape') setEditingOptionId(null) }}
                  className="flex-1 bg-white border border-red-300 rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                />
                <button onClick={() => handleSaveEdit(option.id)} className="p-2 hover:bg-green-100 rounded transition">
                  <Check size={16} className="text-green-600" />
                </button>
                <button onClick={() => setEditingOptionId(null)} className="p-2 hover:bg-gray-200 rounded transition">
                  <X size={16} className="text-gray-500" />
                </button>
              </>
            ) : (
              <>
                {enableIconPicker && option.icon && (
                  <IoniconRender name={option.icon} size={18} className="text-gray-600" />
                )}
                <span className="flex-1 text-gray-700">{option.name}</span>
                <button onClick={() => { setEditingOptionId(option.id); setEditingOptionValue(option.name); setEditingOptionIcon(option.icon || 'star-outline') }} className="p-2 hover:bg-gray-200 rounded transition">
                  <Edit2 size={16} className="text-gray-600" />
                </button>
                <button onClick={() => {
                  if (isCreating) {
                    handleDeleteDraft(option.id)
                  } else {
                    setDeleteTarget({ optionId: option.id, optionName: option.name })
                  }
                }} className="p-2 hover:bg-red-100 rounded transition">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </>
            )}
          </div>
        ))}

        {/* Inline New Option Input */}
        {isAddingNew && (
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
            {enableIconPicker && (
              <button
                onClick={() => setIconPickerTarget('add')}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-red-50 transition"
                title="เลือก icon"
              >
                <IoniconRender name={newOptionIcon} size={18} className="text-gray-700" />
              </button>
            )}
            <input
              autoFocus
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNewOption(); if (e.key === 'Escape') { setIsAddingNew(false); setNewOptionName('') } }}
              placeholder="Enter option name"
              className="flex-1 bg-white border border-red-300 rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <button onClick={handleSaveNewOption} className="p-2 hover:bg-green-100 rounded transition">
              <Check size={16} className="text-green-600" />
            </button>
            <button onClick={() => { setIsAddingNew(false); setNewOptionName('') }} className="p-2 hover:bg-gray-200 rounded transition">
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        )}
      </div>

      {/* Add New Option Button */}
      <button
        onClick={() => setIsAddingNew(true)}
        className="w-full py-2 border-2 border-dashed border-red-300 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition"
      >
        + Add New Option
      </button>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="ลบตัวเลือก"
        message={`คุณต้องการลบ "${deleteTarget?.optionName}" ออกจาก ${title} ใช่หรือไม่?`}
        confirmLabel="ยืนยันลบ"
        confirmVariant="danger"
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteOption?.(id, deleteTarget.optionId)
            setDeleteTarget(null)
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        isOpen={showValidation}
        title="ข้อมูลไม่ครบ"
        message="กรุณากรอกชื่อหมวดหมู่"
        confirmLabel="ตกลง"
        confirmVariant="primary"
        onConfirm={() => setShowValidation(false)}
        onCancel={() => setShowValidation(false)}
      />

      {enableIconPicker && (
        <IconPicker
          isOpen={iconPickerTarget !== null}
          currentIcon={iconPickerTarget === 'add' ? newOptionIcon : editingOptionIcon}
          onSelect={(iconName) => {
            if (iconPickerTarget === 'add') {
              setNewOptionIcon(iconName)
            } else {
              setEditingOptionIcon(iconName)
            }
          }}
          onClose={() => setIconPickerTarget(null)}
        />
      )}
    </div>
  )
}
