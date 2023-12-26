-- CreateTable
CREATE TABLE "Users" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Contacts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spam" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "spamCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Spam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_phoneNumber_key" ON "Users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Spam_phoneNumber_key" ON "Spam"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
