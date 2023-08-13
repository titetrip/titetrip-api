import express from "express";
import { prisma } from "../server.js";

const router = express.Router();

router.put("/update/:id", async (req, res) => {
  let trip = await prisma.trip.update({
    where: {
      id: req.params.id,
    },
    data: {
      name: req.body.name,
      timestamp: req.body.timestamp,
      locationName: req.body.locationName,
      location: req.body.location,
      meetupName: req.body.meetupName,
      meetup: req.body.meetup,
    },
  });
  res.send({ trip: trip.id, statusMessage: "Trip Updated!" });
});

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
            where: { userId: res.locals.user.id, confirmedOnAdding: true },
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

router.delete("/delete/:id", async (req, res) => {
  let gaid = await prisma.group_User.findFirst({
    where: {
      userId: res.locals.user.id,
      isAdmin: true,
      group: {
        Trip: {
          some: {
            id: req.params.id,
          },
        },
      },
    },
  });

  if (gaid) {
    await prisma.trip.delete({
      where: {
        id: req.params.id,
      },
    });
    res.send({ statusMessage: "Trip Deleted!" });
    return;
  }

  res.sendStatus(403);
});

router.get("/:id", async (req, res) => {
  let trip = await prisma.trip.findFirst({
    where: {
      id: req.params.id,
    },
    select: {
      id: true,
      name: true,
      timestamp: true,
      location: true,
      locationName: true,
      meetup: true,
      meetupName: true,
      _count: {
        select: {
          AllItems: {
            where: {
              confirmedOnBringing: false,
              confirmedOnAdding: true,
            },
          },
        },
      },
      group: {
        select: {
          id: true,
          name: true,
          Group_User: {
            orderBy: {
              user: {
                name: "asc",
              },
            },
            select: {
              id: true,
              isAdmin: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                  _count: {
                    select: {
                      Items: {
                        where: { brought: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  res.send({ trip, statusMessage: "Trip Found!" });
});

export default router;
