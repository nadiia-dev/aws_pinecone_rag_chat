/*
  Warnings:

  - A unique constraint covering the columns `[s3Key]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_s3Key_key" ON "File"("s3Key");
