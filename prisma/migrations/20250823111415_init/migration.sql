-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "public"."LeadSource" AS ENUM ('wa', 'web');

-- CreateEnum
CREATE TYPE "public"."LeadStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DECLINED');

-- CreateTable
CREATE TABLE "public"."Property" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "pricePerNight" INTEGER NOT NULL,
    "locationText" TEXT NOT NULL,
    "facilities" TEXT[],
    "status" "public"."Status" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lead" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "source" "public"."LeadSource" NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "checkin" TIMESTAMP(3),
    "checkout" TIMESTAMP(3),
    "guests" INTEGER,
    "status" "public"."LeadStatus" NOT NULL DEFAULT 'PENDING',
    "amount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "public"."Property"("slug");

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
