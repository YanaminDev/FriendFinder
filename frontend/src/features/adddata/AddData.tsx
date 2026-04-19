import { useEffect, useState } from 'react'
import BottomNav from "../../components/Layout/BottomNav"
import TopBar from "../../components/Layout/TopBar"
import CategoryCard from '../../components/Logic Components/CategoryCard'
import { lookupService, type LookupItem } from '../../services/lookup.service'
import { activityService, type ActivityItem } from '../../services/activity.service'

type Tab = 'categories' | 'activity'

const CATEGORIES = [
  { key: 'looking_for', title: 'Looking For' },
  { key: 'drinking', title: 'Drinking' },
  { key: 'smoke', title: 'Smoke' },
  { key: 'workout', title: 'Workout' },
  { key: 'pet', title: 'Pet' },
  { key: 'education', title: 'Education' },
  { key: 'language', title: 'Language' },
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

  const handleAddOption = async (categoryId: string, newName: string, icon?: string) => {
    try {
      await lookupService.create(categoryId, { name: newName, icon: icon || '⭐' })
      await fetchCategory(categoryId as CategoryKey)
    } catch (err) {
      console.error('Failed to add option:', err)
    }
  }

  const handleEditOption = async (categoryId: string, optionId: string, newName: string, icon?: string) => {
    const item = data[categoryId]?.find(i => i.id === optionId)
    if (!item) return
    try {
      await lookupService.update(categoryId, { id: optionId, name: newName, icon: icon || item.icon })
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
      const items = await activityService.getAllAdmin()
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
    <div className="relative min-h-screen bg-[#FAFAFA]">
      <TopBar />

      <div className="mx-auto max-w-2xl px-4 pt-20 pb-24">
        {/* Header */}
        <h1 className="text-center text-lg font-bold tracking-tight text-gray-800">
          Manage Data
        </h1>
        <p className="text-center text-sm text-gray-400 mt-1">Manage user profile categories and activities</p>

        {/* Tabs */}
        <div className="mt-5 flex justify-center gap-1 rounded-full bg-gray-100 p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-[#FD7979] shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-10 w-10 rounded-full border-4 border-[#FD7979]/30 border-t-[#FD7979] animate-spin" />
              <p className="text-sm text-gray-400">กำลังโหลดข้อมูล...</p>
            </div>
          ) : activeTab === 'categories' ? (
            CATEGORIES.map(cat => (
              <CategoryCard
                key={cat.key}
                id={cat.key}
                title={cat.title}
                enableIconPicker
                options={(data[cat.key] || []).map(item => ({ id: item.id, name: item.name, icon: item.icon }))}
                onAddOption={handleAddOption}
                onEditOption={handleEditOption}
                onDeleteOption={handleDeleteOption}
              />
            ))
          ) : (
            <CategoryCard
              id="activity"
              title="Activity"
              enableIconPicker
              options={activities.map(a => ({ id: a.id, name: a.name, icon: a.icon, canDelete: (a.locationCount ?? 0) === 0 }))}
              onAddOption={handleAddActivity}
              onEditOption={handleEditActivity}
              onDeleteOption={handleDeleteActivity}
            />
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
