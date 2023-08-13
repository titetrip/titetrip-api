import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
const prisma = new PrismaClient();

let emptyDatabase = async () => {
  await prisma.group_User.deleteMany();
  await prisma.item.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.user.deleteMany();
  await prisma.group.deleteMany();
};

let insertUser = async (name, surname, email, password) => {
  return await prisma.user.create({
    data: {
      name: name,
      surname: surname,
      email: email,
      password: bcryptjs.hashSync(password),
    },
  });
};

let insertGroup = async (name, isPrivate) => {
  return await prisma.group.create({
    data: {
      name: name,
      isPrivate: isPrivate,
    },
  });
};

let insertTrip = async (name, groupId, locationName, meetupName, timestamp) => {
  return await prisma.trip.create({
    data: {
      name: name,
      timestamp: timestamp,
      groupId: groupId,
      locationName: locationName,
      meetupName: meetupName,
    },
  });
};

let insertItem = async (
  tripId,
  name,
  confirmedOnAdding,
  requestedToBringAdded,
  confirmedOnBringing,
  brought,
  userId = null
) => {
  return await prisma.item.create({
    data: {
      name: name,
      tripId: tripId,
      brought: brought,
      confirmedOnAdding: confirmedOnAdding,
      confirmedOnBringing: confirmedOnBringing,
      requestedToBringAdded: requestedToBringAdded,
      userId: userId,
    },
  });
};

let assignItem = async (itemId, userId) => {
  await prisma.item.update({
    data: {
      userId: userId,
      confirmedOnBringing: true,
    },
    where: {
      id: itemId,
    },
  });
};

let requestItemToBring = async (itemId, userId) => {
  await prisma.item.update({
    data: {
      userId: userId,
      confirmedOnBringing: false,
    },
    where: {
      id: itemId,
    },
  });
};

let requestItemToAdd = async (
  tripId,
  name,
  requestedToBringAdded,
  userId = null
) => {
  return await insertItem(
    tripId,
    name,
    false,
    requestedToBringAdded,
    false,
    false,
    userId
  );
};

let bringItem = async (itemId) => {
  await prisma.item.update({
    data: {
      brought: true,
    },
    where: {
      id: itemId,
    },
  });
};

let insertGroupUser = async (
  userId,
  groupId,
  isAdmin = false,
  confirmed = false
) => {
  await prisma.group_User.create({
    data: {
      userId: userId,
      groupId: groupId,
      confirmed: confirmed,
      isAdmin: isAdmin,
    },
  });
};

export default async function seed() {
  await emptyDatabase();

  let admin = await insertUser(
    "kamil",
    "jarrouj",
    "kamil@jarrouj.com",
    "kamil"
  );
  let user1 = await insertUser(
    "bashour",
    "atrini",
    "bashour@atrini.com",
    "bashour"
  );
  let user2 = await insertUser(
    "ramez",
    "jarrouj",
    "ramez@jarrouj.com",
    "ramez"
  );

  let group = await insertGroup("Jesus", true);
  // admin
  await insertGroupUser(admin.id, group.id, true, true);
  // admin added a user
  await insertGroupUser(user1.id, group.id, false, true);
  // user requested to join group
  await insertGroupUser(user2.id, group.id, false, false);

  let trip = await insertTrip(
    "Babtism",
    group.id,
    "Jesus' House",
    "My Ass",
    new Date()
  );

  let item1 = await insertItem(
    trip.id,
    "holy water",
    true,
    false,
    false,
    false
  );
  await assignItem(item1.id, admin.id);

  let item2 = await insertItem(
    trip.id,
    "clean towel",
    true,
    false,
    false,
    false
  );
  await assignItem(item2.id, user1.id);

  let item3 = await insertItem(trip.id, "shampoo", true, false, false, false);
  await requestItemToBring(item3.id, user2.id);

  let item4 = await requestItemToAdd(trip.id, "food", true, user2.id);
  let item5 = await requestItemToAdd(trip.id, "food", false, user1.id);
  console.log("Done!");
}

seed();
