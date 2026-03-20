import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";

export const userLifeStyleRepository = {
  create : async (user_id : string , looking_for_id : string , drinking_id : string , pet_id : string , smoke_id : string , workout_id : string) =>  {
    return await prisma.user_Life_Style.create({
      data : {
        user_id : user_id ,
        looking_for_id : looking_for_id,
        drinking_id : drinking_id,
        pet_id : pet_id,
        smoke_id : smoke_id,
        workout_id : workout_id
      }
    });
  },

  findByUserId : async (userId : string) => {
    return await prisma.user_Life_Style.findUnique({
      where: { user_id: userId },
      include: {
        looking_for: true,
        drinking: true,
        pet: true,
        smoke: true,
        workout: true
      }
    });
  },

  update : async (userId: string, data: Prisma.User_Life_StyleUpdateInput) => {
    return await prisma.user_Life_Style.update({
      where: { user_id: userId },
      data,
      include: {
        looking_for: true,
        drinking: true,
        pet: true,
        smoke: true,
        workout: true
      }
    });
  },

  updateLookingFor : async (userId: string, lookingForId: string) => {
    return await prisma.user_Life_Style.update({
      where: { user_id: userId },
      data: { looking_for_id: lookingForId },
      include: { looking_for: true }
    });
  },

  updateDrinking : async (userId: string, drinkingId: string) => {
    return await prisma.user_Life_Style.update({
      where: { user_id: userId },
      data: { drinking_id: drinkingId },
      include: { drinking: true }
    });
  },

  updatePet : async (userId: string, petId: string) => {
    return await prisma.user_Life_Style.update({
      where: { user_id: userId },
      data: { pet_id: petId },
      include: { pet: true }
    });
  },

  updateSmoke : async (userId: string, smokeId: string) => {
    return await prisma.user_Life_Style.update({
      where: { user_id: userId },
      data: { smoke_id: smokeId },
      include: { smoke: true }
    });
  },

  updateWorkout : async (userId: string, workoutId: string) => {
    return await prisma.user_Life_Style.update({
      where: { user_id: userId },
      data: { workout_id: workoutId },
      include: { workout: true }
    });
  },

  delete : async (userId: string) => {
    return await prisma.user_Life_Style.delete({
      where: { user_id: userId }
    });
  }
};
