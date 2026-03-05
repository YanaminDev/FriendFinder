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
            throw (err);
        }
    },
    getUserImagesSignedUrl: async (userId: string) => {
        try {
            const userImages = await prisma.user_image.findMany({
                where: {
                    user_id: userId
                }
            });
            
            // ถ้าไม่มีภาพ return empty array
            if (!userImages || userImages.length === 0) {
                return [];
            }

            // สร้าง signed URL สำหรับแต่ละ image (expiry 5 minutes = 300 seconds)
            const imagesWithSignedUrl = await Promise.all(
                userImages.map(async (image) => {
                    // ดึง path จาก URL หรือเก็บไว้ในกองทุนนี้
                    const pathMatch = image.imageUrl.match(/user-images\/(.+)$/);
                    const fileName = pathMatch ? pathMatch[1] : null;
                    const filePath = fileName ? `user-images/${fileName}` : null;

                    if (!filePath) {
                        throw new Error("Invalid image URL format, cannot extract file path");
                    }

                    // สร้าง signed URL ที่ expire ใน 5 นาที
                    const { data, error: signedUrlError } = await supabase.storage
                        .from('userImage')
                        .createSignedUrl(filePath, 5 * 60); // 5 minutes in seconds

                    if (signedUrlError) {
                        throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
                    }

                    if (!data?.signedUrl) {
                        throw new Error("Failed to create signed URL - no signedUrl in response");
                    }

                    return {
                        ...image,
                        imageUrl: data.signedUrl
                    };
                })
            );

            return imagesWithSignedUrl;
        } catch (err) {
            throw (err);
        }
    },

    getUserImages : async (userId : string) => {
        try{
            const userImages = await prisma.user_image.findMany({
                where : {
                    user_id : userId
                }
            })
            return userImages
        }
        catch(err){
            throw (err)
        }
    }
    ,

    deleteUserImage : async (imageId : string, userId : string) => {
        try{
            // ดึง image จาก database เพื่อเก็บ path ก่อน
            const image = await prisma.user_image.findUnique({
                where: {
                    id: imageId
                }
            });

            if (!image || image.user_id !== userId) {
                throw new Error("User image not found or does not belong to the user");
            }

            // สกัด path จาก publicUrl
            const pathMatch = image.imageUrl.match(/user-images\/(.+)$/);
            const fileName = pathMatch ? pathMatch[1] : null;
            const filePath = fileName ? `user-images/${fileName}` : null;

            // ลบจาก Supabase Storage bucket
            if (filePath) {
                const { error } = await supabase.storage
                    .from('userImage')
                    .remove([filePath]);

                if (error) {
                    throw new Error(`Failed to delete image from storage: ${error.message}`);
                }
            }

            // ลบจาก database
            await prisma.user_image.delete({
                where: {
                    id: imageId
                }
            });

            return { success: true, message: "Image deleted successfully" };
        }
        catch(err){
            throw (err)
        }
    },

    updateUserImage : async (imageId : string, userId : string, newImageData : {success : boolean, imageUrl : string , path:string}) => {
        try{
            // ตรวจสอบว่า image นี้เป็นของ user จริง และเก็บ path เดิม
            const existingImage = await prisma.user_image.findFirst({
                where: {
                    id: imageId,
                    user_id: userId
                }
            });

            if (!existingImage) {
                throw new Error("User image not found or does not belong to the user");
            }

            // ลบไฟล์เก่าออกจาก Storage bucket
            const pathMatch = existingImage.imageUrl.match(/user-images\/(.+)$/);
            const fileName = pathMatch ? pathMatch[1] : null;
            const oldFilePath = fileName ? `user-images/${fileName}` : null;

            if (oldFilePath) {
                const { error } = await supabase.storage
                    .from('userImage')
                    .remove([oldFilePath]);

                if (error) {
                    throw new Error(`Failed to delete old image from storage: ${error.message}`);
                }
            }

            // อัปเดต imageUrl ใหม่ใน database
            return await prisma.user_image.update({
                where: {
                    id: imageId
                },
                data: {
                    imageUrl: newImageData.imageUrl
                }
            });
        }
        catch(err){
            throw (err);
        }
    }



}
