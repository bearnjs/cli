import { createRouter, validate } from "@bearnjs/rest";
import { z } from "zod";
import { createUser, getUsers } from "../controllers/users.js";

export const usersRouter = createRouter({ prefix: "/users" });

usersRouter.post("/", validate({
    body: z.object({ name: z.string() })
}), createUser);

usersRouter.get("/", validate({
    query: z.object({
        limit: z.number().default(10),
        page: z.number().default(1)
    })
}), getUsers);