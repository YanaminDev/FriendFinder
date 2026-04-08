import Button from "../../../components/Button"

interface UserActionsProps {
  userId: string
  isAdmin: boolean
  onAddAdmin: (userId: string) => void
  onRemoveAdmin: (userId: string) => void
  onDeleteUser: (userId: string) => void
}

export default function UserActions({
  userId,
  isAdmin,
  onAddAdmin,
  onRemoveAdmin,
  onDeleteUser,
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
          REMOVE ADMIN
        </Button>
      ) : (
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => onAddAdmin(userId)}
        >
          ADD ADMIN
        </Button>
      )}
      <Button
        variant="danger"
        size="sm"
        fullWidth
        onClick={() => onDeleteUser(userId)}
      >
        DELETE
      </Button>
    </div>
  )
}
