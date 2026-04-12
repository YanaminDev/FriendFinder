import { useState } from 'react'
import { X } from 'lucide-react'
import { AVAILABLE_ICONS, getIonicon } from '../utils/ionicon'

interface IconPickerProps {
  isOpen: boolean
  currentIcon: string
  onSelect: (iconName: string) => void
  onClose: () => void
}

export default function IconPicker({ isOpen, currentIcon, onSelect, onClose }: IconPickerProps) {
  const [search, setSearch] = useState('')

  if (!isOpen) return null

  const filtered = search
    ? AVAILABLE_ICONS.filter(name => name.includes(search.toLowerCase()))
    : AVAILABLE_ICONS

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">เลือก Icon</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหา icon... (เช่น cafe, music, game)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-6 gap-2">
            {filtered.map(name => {
              const Icon = getIonicon(name)
              const isSelected = name === currentIcon
              return (
                <button
                  key={name}
                  onClick={() => { onSelect(name); onClose() }}
                  title={name}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition hover:bg-red-50 ${
                    isSelected ? 'bg-red-100 ring-2 ring-red-400' : 'bg-gray-50'
                  }`}
                >
                  <Icon size={24} className={isSelected ? 'text-red-500' : 'text-gray-700'} />
                </button>
              )
            })}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-8">ไม่พบ icon ที่ค้นหา</p>
          )}
        </div>
      </div>
    </div>
  )
}
