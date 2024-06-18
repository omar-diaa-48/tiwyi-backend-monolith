import { Project, Task } from "@prisma/client";
import { IProjectOverviewResponse } from "src/interfaces/response.interface";
import { ChangeLog } from "src/modules/database/mongodb/schemas/change-log.schema";

export type ExtendedTask = Task & {
    logs: ChangeLog[]
}

export type ExtendedProject = Project & {
    overview: IProjectOverviewResponse
}