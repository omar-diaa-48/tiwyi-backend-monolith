import { Task } from "@prisma/client";
import { ChangeLog } from "src/modules/database/mongodb/schemas/change-log.schema";

export type ExtendedTask = Task & {
    logs: ChangeLog[]
}