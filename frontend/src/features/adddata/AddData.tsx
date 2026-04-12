import { useEffect, useState } from 'react'
import BottomNav from "../../components/BottomNav"
import TopBar from "../../components/TopBar"
import CategoryCard from '../../components/CategoryCard'
import { lookupService, type LookupItem } from '../../services/lookup.service'
import { activityService, type ActivityItem } from '../../services/activity.service'

type Tab = 'categories' | 'activity'

const CATEGORIES = [
  { key: 'looking_for', title: 'Looking For', icon: '🔍' },
  { key: 'drinking', title: 'Drinking', icon: '🍷' },
  { key: 'smoke', title: 'Smoke', icon: '🚬' },
  { key: 'workout', title: 'Workout', icon: '💪' },
  { key: 'pet', title: 'Pet', icon: '🐾' },
  { key: 'education', title: 'Education', icon: '🎓' },
  { key: 'language', title: 'Language', icon: '🌐' },
] as const

type CategoryKey = typeof CATEGORIES[number]['key']

export default function AddData() {
  const [activeTab, setActiveTab] = useState<Tab>('categories')

  // Categories state
  const [data, setData] = useState<Record<string, LookupItem[]>>({})
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Activity state
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loadingActivities, setLoadingActivities] = useState(true)

  // ========== Categories ==========
  const fetchAllCategories = async () => {
    try {
      const results = await Promise.all(
        CATEGORIES.map(async (cat) => {
          const items = await lookupService.getAll(cat.key)
          return [cat.key, items] as const
        })
      )
      setData(Object.fromEntries(results))
    } catch (err) {
      console.error('Failed to fetch lookup data:', err)
    } finally {
      setLoadingCategories(false)
    }
  }

  const fetchCategory = async (category: CategoryKey) => {
    try {
      const items = await lookupService.getAll(category)
      setData(prev => ({ ...prev, [category]: items }))
    } catch (err) {
      console.error(`Failed to fetch ${category}:`, err)
    }
  }

  const handleAddOption = async (categoryId: string, newName: string) => {
    const cat = CATEGORIES.find(c => c.key === categoryId)
    if (!cat) return
    try {
      await lookupService.create(categoryId, { name: newName, icon: cat.icon })
      await fetchCategory(categoryId as CategoryKey)
    } catch (err) {
      console.error('Failed to add option:', err)
    }
  }

  const handleEditOption = async (categoryId: string, optionId: string, newName: string) => {
    const item = data[categoryId]?.find(i => i.id === optionId)
    if (!item) return
    try {
      await lookupService.update(categoryId, { id: optionId, name: newName, icon: item.icon })
      await fetchCategory(categoryId as CategoryKey)
    } catch (err) {
      console.error('Failed to edit option:', err)
    }
  }

  const handleDeleteOption = async (categoryId: string, optionId: string) => {
    try {
      await lookupService.remove(categoryId, optionId)
      await fetchCategory(categoryId as CategoryKey)
    } catch (err) {
      console.error('Failed to delete option:', err)
    }
  }

  // ========== Activity ==========
  const fetchActivities = async () => {
    try {
      const items = await activityService.getAll()
      setActivities(items)
    } catch (err) {
      console.error('Failed to fetch activities:', err)
    } finally {
      setLoadingActivities(false)
    }
  }

  const handleAddActivity = async (_categoryId: string, newName: string, icon?: string) => {
    try {
      await activityService.create({ name: newName, icon: icon || 'star-outline' })
      await fetchActivities()
    } catch (err) {
      console.error('Failed to add activity:', err)
    }
  }

  const handleEditActivity = async (_categoryId: string, optionId: string, newName: string, icon?: string) => {
    const item = activities.find(a => a.id === optionId)
    if (!item) return
    try {
      await activityService.update({ id: optionId, name: newName, icon: icon || item.icon })
      await fetchActivities()
    } catch (err) {
      console.error('Failed to edit activity:', err)
    }
  }

  const handleDeleteActivity = async (_categoryId: string, optionId: string) => {
    try {
      await activityService.delete(optionId)
      await fetchActivities()
    } catch (err) {
      console.error('Failed to delete activity:', err)
    }
  }

  useEffect(() => {
    fetchAllCategories()
    fetchActivities()
  }, [])

  const tabs: { key: Tab; label: string }[] = [
    { key: 'categories', label: 'Categories' },
    { key: 'activity', label: 'Activity' },
  ]

  const isLoading = activeTab === 'categories' ? loadingCategories : loadingActivities

  return (
    <div className="relative min-h-screen bg-gray-100">
      <TopBar />

      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Data</h1>
        <p className="text-gray-600 mb-4">Manage user profile categories and activities</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-[#FD7979] to-[#ff9a9a] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : activeTab === 'categories' ? (
          CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.key}
              id={cat.key}
              icon={cat.icon}
              title={cat.title}
              options={(data[cat.key] || []).map(item => ({ id: item.id, name: item.name }))}
              onAddOption={handleAddOption}
              onEditOption={handleEditOption}
              onDeleteOption={handleDeleteOption}
            />
          ))
        ) : (
          <CategoryCard
            id="activity"
            icon="🎯"
            title="Activity"
            enableIconPicker
            options={activities.map(a => ({ id: a.id, name: a.name, icon: a.icon }))}
            onAddOption={handleAddActivity}
            onEditOption={handleEditActivity}
            onDeleteOption={handleDeleteActivity}
          />
        )}
      </div>

      <BottomNav />
    </div>
  )
}
