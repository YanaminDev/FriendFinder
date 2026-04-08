import { useState } from 'react'
import BottomNav from "../../components/BottomNav"
import TopBar from "../../components/TopBar"
import CategoryCard from '../../components/CategoryCard'

interface Option {
  id: string
  name: string
}

interface Category {
  id: string
  icon: string
  title: string
  options: Option[]
}

export default function AddData() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      icon: '',
      title: 'Looking For',
      options: [
        { id: '1-1', name: 'Find Friend' },
        { id: '1-2', name: 'Find Lover' },
        { id: '1-3', name: 'Find Long Relation' },
      ],
    },
    {
      id: '2',
      icon: '🍷',
      title: 'Drinking',
      options: [
        { id: '2-1', name: 'Alway' },
        { id: '2-2', name: 'Often' },
        { id: '2-3', name: 'Never' },
      ],
    },
  ])

  const [showCreateCategory, setShowCreateCategory] = useState(false)

  const handleAddOption = (categoryId: string, newName: string) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, options: [...cat.options, { id: `${cat.id}-${Date.now()}`, name: newName }] }
        : cat
    ))
  }

  const handleEditOption = (categoryId: string, optionId: string, newName: string) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, options: cat.options.map(opt => opt.id === optionId ? { ...opt, name: newName } : opt) }
        : cat
    ))
  }

  const handleDeleteOption = (categoryId: string, optionId: string) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, options: cat.options.filter(opt => opt.id !== optionId) }
        : cat
    ))
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId))
  }

  const handleCreateCategory = (name: string, icon: string, options: Option[]) => {
    setCategories([...categories, { id: `cat-${Date.now()}`, icon, title: name, options }])
    setShowCreateCategory(false)
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      <TopBar />

      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Profile Options</h1>
        <p className="text-gray-600 mb-6">Manage user profile categories and options</p>

        <button
          onClick={() => setShowCreateCategory(true)}
          className="w-full py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition mb-6"
        >
          + Add New Category
        </button>

        {showCreateCategory && (
          <CategoryCard
            isCreating={true}
            onSaveCategory={handleCreateCategory}
            onCancel={() => setShowCreateCategory(false)}
          />
        )}

        {categories.map(category => (
          <CategoryCard
            key={category.id}
            id={category.id}
            icon={category.icon}
            title={category.title}
            options={category.options}
            onAddOption={handleAddOption}
            onEditOption={handleEditOption}
            onDeleteOption={handleDeleteOption}
            onDeleteCategory={handleDeleteCategory}
          />
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
