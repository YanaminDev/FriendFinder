import { Router } from "express";
import { adminRepository } from "./adminRepository";
import { authenticateToken } from "../../common/middleware/authenticate";
import { authorize } from "../../common/middleware/authorize";

export const adminRouter = () => {
    const router = Router();

    // Get all users (admin only)
    router.get("/users", authenticateToken, authorize("admin"), async (_req, res) => {
        try {
            const users = await adminRepository.getAllUsers();
            return res.status(200).json(users);
        } catch (err) {
            return res.status(500).json({ message: "Failed to fetch users" });
        }
    });

    // Update user role (admin only)
    router.patch("/users/:id/role", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const id = String(req.params.id);
            const role = String(req.body.role);

            if (!role || !['user', 'admin'].includes(role)) {
                return res.status(400).json({ message: "Invalid role. Must be 'user' or 'admin'" });
            }

            const updatedUser = await adminRepository.updateUserRole(id, role as 'user' | 'admin');
            return res.status(200).json(updatedUser);
        } catch (err) {
            return res.status(500).json({ message: "Failed to update user role" });
        }
    });

    // Ban user (admin only)
    router.patch("/users/:id/ban", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const id = String(req.params.id);
            const bannedUser = await adminRepository.banUser(id);
            return res.status(200).json(bannedUser);
        } catch (err) {
            return res.status(500).json({ message: "Failed to ban user" });
        }
    });

    // Unban user (admin only)
    router.patch("/users/:id/unban", authenticateToken, authorize("admin"), async (req, res) => {
        try {
            const id = String(req.params.id);
            const unbannedUser = await adminRepository.unbanUser(id);
            return res.status(200).json(unbannedUser);
        } catch (err) {
            return res.status(500).json({ message: "Failed to unban user" });
        }
    });

    // Verify admin token
    router.get("/verify", authenticateToken, authorize("admin"), async (_req, res) => {
        return res.status(200).json({ ok: true });
    });

    return router;
};
