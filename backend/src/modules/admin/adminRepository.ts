import { prisma } from "../../../lib/prisma";

export const adminRepository = {
    getAllUsers: async () => {
        return await prisma.user.findMany({
            select: {
                user_id: true,
                user_show_name: true,
                username: true,
                role: true,
                sex: true,
                age: true,
                isOnline: true,
                isBanned: true,
                info: {
                    select: {
                        user_height: true,
                        language: { select: { id: true, name: true } },
                        education: { select: { id: true, name: true } },
                    }
                },
                life_style: {
                    select: {
                        looking_for: { select: { id: true, name: true } },
                        drinking: { select: { id: true, name: true } },
                        pet: { select: { id: true, name: true } },
                        smoke: { select: { id: true, name: true } },
                        workout: { select: { id: true, name: true } },
                    }
                },
                images: {
                    take: 1,
                    orderBy: { createdAt: 'asc' },
                    select: { imageUrl: true }
                },
            },
            orderBy: { user_show_name: 'asc' }
        });
    },

    updateUserRole: async (user_id: string, role: 'user' | 'admin') => {
        return await prisma.user.update({
            where: { user_id },
            data: { role },
            select: {
                user_id: true,
                user_show_name: true,
                username: true,
                role: true,
                sex: true,
                age: true,
                isOnline: true,
                isBanned: true,
            }
        });
    },

    banUser: async (user_id: string) => {
        return await prisma.user.update({
            where: { user_id },
            data: { isBanned: true },
            select: {
                user_id: true,
                user_show_name: true,
                username: true,
                role: true,
                sex: true,
                age: true,
                isOnline: true,
                isBanned: true,
            }
        });
    },

    unbanUser: async (user_id: string) => {
        return await prisma.user.update({
            where: { user_id },
            data: { isBanned: false },
            select: {
                user_id: true,
                user_show_name: true,
                username: true,
                role: true,
                sex: true,
                age: true,
                isOnline: true,
                isBanned: true,
            }
        });
    },
};
