import { prisma } from "../../../lib/prisma";
import { supabase } from "../../../lib/supabase";

export const locationImageRepository = {
    createLocationImage : async (data : {locationImageData : {success : boolean, imageUrl : string , path:string}, locationId : string}) => {
        try{
            return await prisma.location_image.create({
                data : {
                    imageUrl : data.locationImageData.imageUrl,
                    location_id : data.locationId
                }
            })
        }
        catch(err){
            throw (err);
        }
    },
    getLocationImagesSignedUrl: async (locationId: string) => {
        try {
            const locationImages = await prisma.location_image.findMany({
                where: {
                    location_id: locationId
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
            
            // ถ้าไม่มีภาพ return empty array
            if (!locationImages || locationImages.length === 0) {
                return [];
            }

            // สร้าง signed URL สำหรับแต่ละ image (expiry 5 minutes = 300 seconds)
            const imagesWithSignedUrl = await Promise.all(
                locationImages.map(async (image) => {
                    // ดึง path จาก URL หรือเก็บไว้ในฐานข้อมูล
                    const pathMatch = image.imageUrl.match(/location-images\/(.+)$/);
                    const fileName = pathMatch ? pathMatch[1] : null;
                    const filePath = fileName ? `location-images/${fileName}` : null;

                    if (!filePath) {
                        throw new Error("Invalid image URL format, cannot extract file path");
                    }

                    // สร้าง signed URL ที่ expire ใน 5 นาที
                    const { data, error: signedUrlError } = await supabase.storage
                        .from('locationImage')
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

    getSignedUrlSchemaWithId : async (id : string , locationId : string) => {
        try{
            const locationImage = await prisma.location_image.findFirst({
                where : {
                    id : id , 
                    location_id : locationId
                } 
            })
            if (!locationImage) {
                throw new Error("Location image not found or does not belong to the location");
            }

            const pathMatch = locationImage.imageUrl.match(/location-images\/(.+)$/);
            const fileName = pathMatch ? pathMatch[1] : null;
            const filePath = fileName ? `location-images/${fileName}` : null;
            if (!filePath) {
                throw new Error("Invalid image URL format, cannot extract file path");
            }

           
            const { data, error: signedUrlError } = await supabase.storage
                .from('locationImage')
                .createSignedUrl(filePath, 5 * 60); // 5 minutes in seconds

            if (signedUrlError) {
                throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
            }

            if (!data?.signedUrl) {
                throw new Error("Failed to create signed URL - no signedUrl in response");
            }

            return {
                ...locationImage,
                imageUrl: data.signedUrl
            }


        }
        catch(err){
            throw (err)
        }
    },

    getLocationImages : async (locationId : string) => {
        try{
            const locationImages = await prisma.location_image.findMany({
                where : {
                    location_id : locationId
                }
            })
            return locationImages
        }
        catch(err){
            throw (err)
        }
    }
    ,
    getLocationImagesById : async (id : string ,locationId : string) => {
        try{
            const locationImage = await prisma.location_image.findFirst({
                where :{
                    id : id,
                    location_id : locationId

                }
                
            })
            return locationImage
        }
        catch(err){
            throw (err)
        }
    }
    ,
    deleteLocationImage : async (imageId : string, locationId : string) => {
        try{
            // ดึง image จาก database เพื่อเก็บ path ก่อน
            const image = await prisma.location_image.findUnique({
                where: {
                    id: imageId
                }
            });

            if (!image || image.location_id !== locationId) {
                throw new Error("Location image not found or does not belong to the location");
            }

            // สกัด path จาก publicUrl
            const pathMatch = image.imageUrl.match(/location-images\/(.+)$/);
            const fileName = pathMatch ? pathMatch[1] : null;
            const filePath = fileName ? `location-images/${fileName}` : null;

            // ลบจาก Supabase Storage bucket
            if (filePath) {
                const { error } = await supabase.storage
                    .from('locationImage')
                    .remove([filePath]);

                if (error) {
                    throw new Error(`Failed to delete image from storage: ${error.message}`);
                }
            }

            // ลบจาก database
            await prisma.location_image.delete({
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

    updateLocationImage : async (imageId : string, locationId : string, newImageData : {success : boolean, imageUrl : string , path:string}) => {
        try{
            // ตรวจสอบว่า image นี้เป็นของ location จริง และเก็บ path เดิม
            const existingImage = await prisma.location_image.findFirst({
                where: {
                    id: imageId,
                    location_id: locationId
                }
            });

            if (!existingImage) {
                throw new Error("Location image not found or does not belong to the location");
            }

            // ลบไฟล์เก่าออกจาก Storage bucket
            const pathMatch = existingImage.imageUrl.match(/location-images\/(.+)$/);
            const fileName = pathMatch ? pathMatch[1] : null;
            const oldFilePath = fileName ? `location-images/${fileName}` : null;

            if (oldFilePath) {
                const { error } = await supabase.storage
                    .from('locationImage')
                    .remove([oldFilePath]);

                if (error) {
                    throw new Error(`Failed to delete old image from storage: ${error.message}`);
                }
            }

            // อัปเดต imageUrl ใหม่ใน database
            return await prisma.location_image.update({
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
