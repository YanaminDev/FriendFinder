import { prisma } from "../../../lib/prisma";

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
    }

}


