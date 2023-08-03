-- CreateTable
CREATE TABLE "Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "needsConfirmation" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Group_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "confirmed" BOOLEAN NOT NULL,
    CONSTRAINT "Group_User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Group_User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "meetupLocation" TEXT,
    "timestamp" DATETIME NOT NULL,
    CONSTRAINT "Trip_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tripId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "numberOfPeople" INTEGER NOT NULL,
    "confirmed" BOOLEAN NOT NULL,
    CONSTRAINT "Item_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "confirmed" BOOLEAN NOT NULL,
    "adminRequested" BOOLEAN NOT NULL,
    CONSTRAINT "Item_User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Item_User_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User_Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "User_Template_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item_Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userTemplateId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "numberOfPeople" INTEGER NOT NULL,
    CONSTRAINT "Item_Template_userTemplateId_fkey" FOREIGN KEY ("userTemplateId") REFERENCES "User_Template" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
