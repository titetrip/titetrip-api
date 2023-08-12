import express from "express";
import { prisma } from "../server.js";

const router = express.Router();

router.get("/active-trips", async (req, res) => {
  let result = await prisma.trip.findMany({
    where: {
      timestamp: { gte: new Date() },
      group: {
        Group_User: {
          some: { userId: res.locals.user.id },
        },
      },
    },
    select: {
      _count: {
        select: {
          AllItems: {
            where: { userId: res.locals.user.id },
          },
          BroughtItems: {
            where: {
              userId: res.locals.user.id,
              brought: true,
            },
          },
          NotifiableItems: {
            where: {
              OR: [
                { confirmedOnAdding: false },
                { confirmedOnBringing: false },
              ],
            },
          },
        },
      },
      id: true,
      name: true,
      timestamp: true,
      group: { select: { id: true, name: true } },
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  res.send(result);
});

router.get("/all-trips", async (req, res) => {
  let result = await prisma.trip.findMany({
    where: {
      group: {
        Group_User: {
          some: { userId: res.locals.user.id },
        },
      },
    },
    select: {
      _count: {
        select: {
          AllItems: {
            where: { userId: res.locals.user.id },
          },
          BroughtItems: {
            where: {
              userId: res.locals.user.id,
              brought: true,
            },
          },
          NotifiableItems: {
            where: {
              OR: [
                { confirmedOnAdding: false },
                { confirmedOnBringing: false },
              ],
            },
          },
        },
      },
      id: true,
      name: true,
      timestamp: true,
      group: { select: { id: true, name: true } },
    },
    orderBy: {
      timestamp: "desc",
    },
    take: Number(req.query.take),
    skip: Number(req.query.skip),
  });
  res.send(result);
});

router.post("/create", async (req, res) => {
  let trip = await prisma.trip.create({
    data: {
      name: req.body.name,
      timestamp: req.body.timestamp,
      groupId: req.body.groupId,
      locationName: req.body.locationName,
      location: req.body.location,
      meetupName: req.body.meetupName,
      meetup: req.body.meetup,
    },
  });
  res.send({ trip: trip.id, statusMessage: "Trip Created!" });
});
export default router;
