import { IoMale, IoFemale, IoTransgender } from 'react-icons/io5'

interface LookupValue {
  id: string
  name: string
}

interface User {
  user_id: string
  user_show_name: string
  username: string
  role: string
  sex: string
  age: number
  info?: {
    user_height: number | null
    user_bio: string | null
    blood_group: string | null
    language: LookupValue | null
    education: LookupValue | null
  } | null
  life_style?: {
    looking_for: LookupValue | null
    drinking: LookupValue | null
    pet: LookupValue | null
    smoke: LookupValue | null
    workout: LookupValue | null
  } | null
  images?: { imageUrl: string }[]
}

interface UserInfoProps {
  user: User
}

export default function UserInfo({ user }: UserInfoProps) {
  const infoItems = [
    { label: "Education", value: user.info?.education?.name || "-" },
    { label: "Height", value: user.info?.user_height ? `${user.info.user_height} cm` : "-" },
    { label: "Language", value: user.info?.language?.name || "-" },
    { label: "Blood Group", value: user.info?.blood_group || "-" },
    { label: "Looking For", value: user.life_style?.looking_for?.name || "-" },
    { label: "Smoking", value: user.life_style?.smoke?.name || "-" },
    { label: "Drinking", value: user.life_style?.drinking?.name || "-" },
    { label: "Workout", value: user.life_style?.workout?.name || "-" },
    { label: "Pet", value: user.life_style?.pet?.name || "-" },
  ]

  const bio = user.info?.user_bio

  const getSexBadge = () => {
    switch (user.sex) {
      case "male":
        return { cls: "bg-blue-100 text-blue-600", label: "Male", Icon: IoMale }
      case "female":
        return { cls: "bg-pink-100 text-pink-600", label: "Female", Icon: IoFemale }
      default:
        return { cls: "bg-purple-100 text-purple-600", label: "LGBTQ", Icon: IoTransgender }
    }
  }

  const sex = getSexBadge()

  const getFieldColor = (label: string) => {
    const colors: Record<string, { bg: string; border: string; label: string }> = {
      "Education": { bg: "bg-blue-50", border: "border-blue-200", label: "text-blue-600" },
      "Height": { bg: "bg-green-50", border: "border-green-200", label: "text-green-600" },
      "Language": { bg: "bg-purple-50", border: "border-purple-200", label: "text-purple-600" },
      "Blood Group": { bg: "bg-orange-50", border: "border-orange-200", label: "text-orange-600" },
      "Looking For": { bg: "bg-rose-50", border: "border-rose-200", label: "text-rose-600" },
      "Smoking": { bg: "bg-amber-50", border: "border-amber-200", label: "text-amber-600" },
      "Drinking": { bg: "bg-cyan-50", border: "border-cyan-200", label: "text-cyan-600" },
      "Workout": { bg: "bg-emerald-50", border: "border-emerald-200", label: "text-emerald-600" },
      "Pet": { bg: "bg-indigo-50", border: "border-indigo-200", label: "text-indigo-600" },
    }
    return colors[label] || { bg: "bg-gray-50", border: "border-gray-200", label: "text-gray-600" }
  }

  return (
    <div className="space-y-4">
      {/* Sex & Age row */}
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1 ${sex.cls}`}>
          <sex.Icon className="h-3 w-3" />
          {sex.label}
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
          Age {user.age}
        </span>
      </div>

      {/* Bio */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2">
        <p className="text-[10px] font-medium uppercase tracking-wide text-blue-600">Bio</p>
        <p className="text-xs font-semibold text-gray-700">{bio || "-"}</p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-2">
        {infoItems.map((item, idx) => {
          const color = getFieldColor(item.label)
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 rounded-lg ${color.bg} border ${color.border} px-3 py-2`}
            >
              <div>
                <p className={`text-[10px] font-medium uppercase tracking-wide ${color.label}`}>
                  {item.label}
                </p>
                <p className="text-xs font-semibold text-gray-700">{item.value}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
