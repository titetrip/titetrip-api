import userRoute from "../routes/userRoute.js";
import tripRoute from "../routes/tripRoute.js";
export default function postAuthRouter(app) {
  app.use("/users", userRoute);

  app.use("/trips", tripRoute);
}
