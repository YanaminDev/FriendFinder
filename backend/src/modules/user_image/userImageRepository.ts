import { prisma } from "../../../lib/prisma";
import { supabase } from "../../../lib/supabase";

export const userImageRepository = {
    createUserImage : async (data : {userImageData : {success : boolean, imageUrl : string , path:string}, userId : string}) => {
        try{
            return await prisma.user_image.create({
                data : {
                    imageUrl : data.userImageData.imageUrl,
                    user_id : data.userId
                }
            })
        }
        catch(err){
            throw new Error("Failed to create user image")
        }
    },
    getUserImages: async (userId: string) => {
        try {
            const userImages = await prisma.user_image.findMany({
                where: {
                    user_id: userId
                }
            });

            // สร้าง signed URL สำหรับแต่ละ image (expiry 5 minutes = 300 seconds)
            const imagesWithSignedUrl = await Promise.all(
                userImages.map(async (image) => {
                    // ดึง path จาก URL หรือเก็บไว้ในกองทุนนี้
                    const pathMatch = image.imageUrl.match(/user-images\/(.+)$/);
                    const filePath = pathMatch ? `user-images/${pathMatch[1]}` : null;

                    if (!filePath) {
                        throw new Error("Invalid image URL format, cannot extract file path");
                    }

                    // สร้าง signed URL ที่ expire ใน 5 นาที
                    const { data } = await supabase.storage
                        .from('userImage')
                        .createSignedUrl(filePath, 5 * 60); // 5 minutes in seconds

                    if (!data?.signedUrl) {
                        throw new Error("Failed to create signed URL");
                    }

                    return {
                        ...image,
                        imageUrl: data.signedUrl  // ← เฉพาะ signed URL เท่านั้น
                    };
                })
            );

            return imagesWithSignedUrl;
        } catch (err) {
            throw new Error("Failed to fetch user images");
        }
    }

}


