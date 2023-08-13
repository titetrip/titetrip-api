/*
  Warnings:

  - You are about to drop the column `requestedToBring` on the `Item` table. All the data in the column will be lost.
  - Added the required column `requestedToBringAdded` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "confirmed" BOOLEAN NOT NULL,
    CONSTRAINT "Group_User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Group_User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Group_User" ("confirmed", "groupId", "id", "isAdmin", "userId") SELECT "confirmed", "groupId", "id", "isAdmin", "userId" FROM "Group_User";
DROP TABLE "Group_User";
ALTER TABLE "new_Group_User" RENAME TO "Group_User";
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "confirmedOnAdding" BOOLEAN NOT NULL,
    "requestedToBringAdded" BOOLEAN NOT NULL,
    "confirmedOnBringing" BOOLEAN NOT NULL,
    "brought" BOOLEAN NOT NULL,
    CONSTRAINT "Item_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Item_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Item_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("brought", "confirmedOnAdding", "confirmedOnBringing", "id", "name", "tripId", "userId") SELECT "brought", "confirmedOnAdding", "confirmedOnBringing", "id", "name", "tripId", "userId" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE TABLE "new_Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "locationName" TEXT,
    "meetup" TEXT,
    "meetupName" TEXT,
    "timestamp" DATETIME NOT NULL,
    CONSTRAINT "Trip_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Trip" ("groupId", "id", "location", "locationName", "meetup", "meetupName", "name", "timestamp") SELECT "groupId", "id", "location", "locationName", "meetup", "meetupName", "name", "timestamp" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
