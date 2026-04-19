import Button from "../../../components/UI Components (Reusable)/Button"

interface UserActionsProps {
  userId: string
  isAdmin: boolean
  isBanned: boolean
  onAddAdmin: (userId: string) => void
  onRemoveAdmin: (userId: string) => void
  onBanUser: (userId: string) => void
  onUnbanUser: (userId: string) => void
}

export default function UserActions({
  userId,
  isAdmin,
  isBanned,
  onAddAdmin,
  onRemoveAdmin,
  onBanUser,
  onUnbanUser,
}: UserActionsProps) {
  return (
    <div className="flex items-center gap-3">
      {isAdmin ? (
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => onRemoveAdmin(userId)}
        >
          Revoke Admin
        </Button>
      ) : (
        <Button
          variant="admin"
          size="sm"
          fullWidth
          onClick={() => onAddAdmin(userId)}
        >
          Grant Admin
        </Button>
      )}
      {isBanned ? (
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => onUnbanUser(userId)}
        >
          Unban
        </Button>
      ) : (
        <Button
          variant="danger"
          size="sm"
          fullWidth
          onClick={() => onBanUser(userId)}
        >
          Ban User
        </Button>
      )}
    </div>
  )
}
