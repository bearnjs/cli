import createApp from "@bearn/rest";
import { usersRouter } from "./routes/users.js";

const app = createApp({
  host: "0.0.0.0",
  port: 8000,
  rootPrefix: "/api",
  cors: {
    credentials: true,
    origin: "http://localhost:5173"
  },
  printRoutes: true
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use(usersRouter);

app.start();
