import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { HrMsModule } from "./hr/hr-ms.module";
import { NotificationMsModule } from "./notification/notification-ms.module";
import { WorkmatiqMsModule } from "./workmatiq/workmatiq-ms.module";

const modules = [
    DatabaseModule,
    AuthModule,
    HrMsModule,
    NotificationMsModule,
    WorkmatiqMsModule
];

export default modules;