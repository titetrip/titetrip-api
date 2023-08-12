import express from "express";
import { prisma } from "../server.js";
import bcryptjs from "bcryptjs";

const router = express.Router();

router.put("/update", async (req, res) => {
  let changePassword = {};

  if (req.body.newPassword) {
    if (!bcryptjs.compareSync(req.body.password, res.locals.user.password)) {
      res.sendStatus(401);
      return;
    }
    changePassword["password"] = bcryptjs.hashSync(req.body.newPassword);
  }

  await prisma.user.update({
    data: {
      name: req.body.name,
      email: req.body.email,
      surname: req.body.surname,
      ...changePassword,
    },
    where: { id: res.locals.user.id },
  });
  res.send({ statusMessage: "User Updated!" });
});
export default router;
