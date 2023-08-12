/*
  Warnings:

  - You are about to drop the column `meetupLocation` on the `Trip` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "locationName" TEXT,
    "meetup" TEXT,
    "meetupName" TEXT,
    "timestamp" DATETIME NOT NULL,
    CONSTRAINT "Trip_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Trip" ("groupId", "id", "location", "name", "timestamp") SELECT "groupId", "id", "location", "name", "timestamp" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
