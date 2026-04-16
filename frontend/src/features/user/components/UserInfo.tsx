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
}

interface UserInfoProps {
  user: User
}

export default function UserInfo({ user }: UserInfoProps) {
  const infoItems = [
    { label: "Education", value: user.info?.education?.name || "-" },
    { label: "Height", value: user.info?.user_height ? `${user.info.user_height} cm` : "-" },
    { label: "Language", value: user.info?.language?.name || "-" },
    { label: "Looking For", value: user.life_style?.looking_for?.name || "-" },
    { label: "Smoking", value: user.life_style?.smoke?.name || "-" },
    { label: "Drinking", value: user.life_style?.drinking?.name || "-" },
    { label: "Workout", value: user.life_style?.workout?.name || "-" },
    { label: "Pet", value: user.life_style?.pet?.name || "-" },
  ]

  const getSexBadge = () => {
    switch (user.sex) {
      case "male":
        return { cls: "bg-blue-100 text-blue-600", label: "♂ Male" }
      case "female":
        return { cls: "bg-pink-100 text-pink-600", label: "♀ Female" }
      default:
        return { cls: "bg-purple-100 text-purple-600", label: "⚢ LGBTQ" }
    }
  }

  const sex = getSexBadge()

  return (
    <div className="space-y-4">
      {/* Sex & Age row */}
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${sex.cls}`}>
          {sex.label}
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
          Age {user.age}
        </span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-2">
        {infoItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2"
          >
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                {item.label}
              </p>
              <p className="text-xs font-semibold text-gray-700">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
