-- CreateTable
CREATE TABLE "Space" (
    "Id" TEXT NOT NULL,
    "spaceName" TEXT NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "User" (
    "Id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
