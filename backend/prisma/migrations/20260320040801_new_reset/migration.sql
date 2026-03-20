-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('male', 'female', 'lgbtq');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "Blood_Group" AS ENUM ('A', 'B', 'AB', 'O');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "user_show_name" VARCHAR(50) NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "sex" "Sex" NOT NULL,
    "age" INTEGER NOT NULL,
    "interested_gender" "Sex" NOT NULL,
    "birth_of_date" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "User_image" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Information" (
    "user_id" TEXT NOT NULL,
    "user_height" INTEGER NOT NULL,
    "user_bio" TEXT NOT NULL,
    "blood_group" "Blood_Group" NOT NULL,
    "language_id" TEXT NOT NULL,
    "education_id" TEXT NOT NULL,

    CONSTRAINT "User_Information_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Life_Style" (
    "user_id" TEXT NOT NULL,
    "looking_for_id" TEXT NOT NULL,
    "drinking_id" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,
    "smoke_id" TEXT NOT NULL,
    "workout_id" TEXT NOT NULL,

    CONSTRAINT "User_Life_Style_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Looking_for" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Looking_for_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drinking" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Drinking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Smoke" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Smoke_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "position_id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "open_date" TEXT,
    "open_time" TEXT,
    "close_time" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location_image" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Location_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location_review" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "match_id" TEXT NOT NULL,

    CONSTRAINT "Location_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "user1_id" TEXT NOT NULL,
    "user2_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "cancel_status" BOOLEAN NOT NULL DEFAULT false,
    "end_date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Find_Match" (
    "user_id" TEXT NOT NULL,
    "position_id" TEXT NOT NULL,
    "activity_id1" TEXT,
    "activity_id2" TEXT,
    "activity_id3" TEXT,

    CONSTRAINT "Find_Match_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "user1_id" TEXT NOT NULL,
    "user2_id" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat_Message" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chattype" TEXT NOT NULL,

    CONSTRAINT "Chat_Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "information" TEXT,
    "phone" TEXT,
    "open_date" TEXT,
    "open_time" TEXT,
    "close_time" TEXT,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,
    "status" INTEGER NOT NULL,
    "match_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "reviewee_id" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cancellation" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "match_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "reviewee_id" TEXT NOT NULL,
    "quick_select_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cancellation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Select_Cancel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Select_Cancel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_password_user_show_name_interested_gender_idx" ON "User"("username", "password", "user_show_name", "interested_gender");

-- CreateIndex
CREATE UNIQUE INDEX "User_image_imageUrl_key" ON "User_image"("imageUrl");

-- CreateIndex
CREATE INDEX "User_image_user_id_imageUrl_idx" ON "User_image"("user_id", "imageUrl");

-- CreateIndex
CREATE INDEX "User_Information_user_id_user_bio_idx" ON "User_Information"("user_id", "user_bio");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE INDEX "Language_name_idx" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Education_name_key" ON "Education"("name");

-- CreateIndex
CREATE INDEX "Education_name_idx" ON "Education"("name");

-- CreateIndex
CREATE INDEX "User_Life_Style_looking_for_id_idx" ON "User_Life_Style"("looking_for_id");

-- CreateIndex
CREATE UNIQUE INDEX "Looking_for_name_key" ON "Looking_for"("name");

-- CreateIndex
CREATE INDEX "Looking_for_name_idx" ON "Looking_for"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Drinking_name_key" ON "Drinking"("name");

-- CreateIndex
CREATE INDEX "Drinking_name_idx" ON "Drinking"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_name_key" ON "Pet"("name");

-- CreateIndex
CREATE INDEX "Pet_name_idx" ON "Pet"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Smoke_name_key" ON "Smoke"("name");

-- CreateIndex
CREATE INDEX "Smoke_name_idx" ON "Smoke"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Workout_name_key" ON "Workout"("name");

-- CreateIndex
CREATE INDEX "Workout_name_idx" ON "Workout"("name");

-- CreateIndex
CREATE INDEX "Location_name_position_id_activity_id_open_date_open_time_idx" ON "Location"("name", "position_id", "activity_id", "open_date", "open_time");

-- CreateIndex
CREATE UNIQUE INDEX "Location_image_imageUrl_key" ON "Location_image"("imageUrl");

-- CreateIndex
CREATE INDEX "Location_image_location_id_imageUrl_idx" ON "Location_image"("location_id", "imageUrl");

-- CreateIndex
CREATE INDEX "Location_review_location_id_user_id_match_id_status_idx" ON "Location_review"("location_id", "user_id", "match_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_name_key" ON "Activity"("name");

-- CreateIndex
CREATE INDEX "Activity_name_idx" ON "Activity"("name");

-- CreateIndex
CREATE INDEX "Match_user1_id_user2_id_location_id_activity_id_idx" ON "Match"("user1_id", "user2_id", "location_id", "activity_id");

-- CreateIndex
CREATE INDEX "Find_Match_position_id_idx" ON "Find_Match"("position_id");

-- CreateIndex
CREATE INDEX "Chat_user1_id_user2_id_idx" ON "Chat"("user1_id", "user2_id");

-- CreateIndex
CREATE INDEX "Chat_Message_chat_id_sender_id_message_idx" ON "Chat_Message"("chat_id", "sender_id", "message");

-- CreateIndex
CREATE UNIQUE INDEX "Position_name_key" ON "Position"("name");

-- CreateIndex
CREATE INDEX "Position_name_open_date_open_time_idx" ON "Position"("name", "open_date", "open_time");

-- CreateIndex
CREATE INDEX "Experience_match_id_reviewer_id_reviewee_id_status_idx" ON "Experience"("match_id", "reviewer_id", "reviewee_id", "status");

-- CreateIndex
CREATE INDEX "Cancellation_match_id_reviewer_id_reviewee_id_idx" ON "Cancellation"("match_id", "reviewer_id", "reviewee_id");

-- CreateIndex
CREATE UNIQUE INDEX "Select_Cancel_name_key" ON "Select_Cancel"("name");

-- CreateIndex
CREATE INDEX "Select_Cancel_name_idx" ON "Select_Cancel"("name");

-- AddForeignKey
ALTER TABLE "User_image" ADD CONSTRAINT "User_image_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Information" ADD CONSTRAINT "User_Information_education_id_fkey" FOREIGN KEY ("education_id") REFERENCES "Education"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Information" ADD CONSTRAINT "User_Information_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Information" ADD CONSTRAINT "User_Information_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Life_Style" ADD CONSTRAINT "User_Life_Style_drinking_id_fkey" FOREIGN KEY ("drinking_id") REFERENCES "Drinking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Life_Style" ADD CONSTRAINT "User_Life_Style_looking_for_id_fkey" FOREIGN KEY ("looking_for_id") REFERENCES "Looking_for"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Life_Style" ADD CONSTRAINT "User_Life_Style_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Life_Style" ADD CONSTRAINT "User_Life_Style_smoke_id_fkey" FOREIGN KEY ("smoke_id") REFERENCES "Smoke"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Life_Style" ADD CONSTRAINT "User_Life_Style_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Life_Style" ADD CONSTRAINT "User_Life_Style_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location_image" ADD CONSTRAINT "Location_image_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location_review" ADD CONSTRAINT "Location_review_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location_review" ADD CONSTRAINT "Location_review_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location_review" ADD CONSTRAINT "Location_review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Find_Match" ADD CONSTRAINT "Find_Match_activity_id1_fkey" FOREIGN KEY ("activity_id1") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Find_Match" ADD CONSTRAINT "Find_Match_activity_id2_fkey" FOREIGN KEY ("activity_id2") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Find_Match" ADD CONSTRAINT "Find_Match_activity_id3_fkey" FOREIGN KEY ("activity_id3") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Find_Match" ADD CONSTRAINT "Find_Match_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Find_Match" ADD CONSTRAINT "Find_Match_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat_Message" ADD CONSTRAINT "Chat_Message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat_Message" ADD CONSTRAINT "Chat_Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_reviewee_id_fkey" FOREIGN KEY ("reviewee_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cancellation" ADD CONSTRAINT "Cancellation_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cancellation" ADD CONSTRAINT "Cancellation_quick_select_id_fkey" FOREIGN KEY ("quick_select_id") REFERENCES "Select_Cancel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cancellation" ADD CONSTRAINT "Cancellation_reviewee_id_fkey" FOREIGN KEY ("reviewee_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cancellation" ADD CONSTRAINT "Cancellation_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
