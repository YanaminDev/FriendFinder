import { useState } from 'react'
import { Trash2, Edit2, Check, X } from 'lucide-react'

interface OptionItemProps {
  id: string
  name: string
  onSaveEdit: (id: string, newName: string) => void
  onDelete: (id: string) => void
}

export default function OptionItem({ id, name, onSaveEdit, onDelete }: OptionItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(name)

  const handleSave = () => {
    if (!value.trim()) return
    onSaveEdit(id, value)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setValue(name)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 mb-2">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
          className="flex-1 bg-white border border-red-300 rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300"
        />
        <button onClick={handleSave} className="p-2 hover:bg-green-100 rounded transition">
          <Check size={16} className="text-green-600" />
        </button>
        <button onClick={handleCancel} className="p-2 hover:bg-gray-200 rounded transition">
          <X size={16} className="text-gray-500" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-2">
      <span className="text-gray-700">{name}</span>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 hover:bg-gray-200 rounded transition"
        >
          <Edit2 size={16} className="text-gray-600" />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-2 hover:bg-red-100 rounded transition"
        >
          <Trash2 size={16} className="text-red-500" />
        </button>
      </div>
    </div>
  )
}
