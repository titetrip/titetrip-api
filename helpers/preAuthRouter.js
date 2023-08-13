import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { prisma } from "../server.js";
import { json } from "express";
export default function preAuthRouter(app) {
  app.post("/signup", async (req, res) => {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        password: bcryptjs.hashSync(req.body.password),
      },
    });

    const accessToken = jwt.sign(Object(user), process.env.ACCESS_TOKEN_SECRET);

    res.send({ accessToken: accessToken, user: user });
  });

  app.post("/login", async (req, res) => {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (bcryptjs.compareSync(req.body.password, user.password)) {
      const accessToken = jwt.sign(
        Object(user),
        process.env.ACCESS_TOKEN_SECRET
      );
      res.send({ accessToken: accessToken, user: user });
    } else {
      res.sendStatus(401);
    }
  });
}
