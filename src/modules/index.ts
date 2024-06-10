import { AuthModule } from "./auth/auth.module";
import { BaseModule } from "./base/base.modules";
import { ChangeLogModule } from "./change-log/change-log.module";
import { DatabaseModule } from "./database/database.module";
import { HrMsModule } from "./hr/hr-ms.module";
import { NotificationMsModule } from "./notification/notification-ms.module";
import { StorageModule } from "./storage/storage.module";
import { WorkmatiqMsModule } from "./workmatiq/workmatiq-ms.module";

const modules = [
    DatabaseModule,
    ChangeLogModule,
    StorageModule,
    BaseModule,
    AuthModule,
    HrMsModule,
    NotificationMsModule,
    WorkmatiqMsModule,
];

export default modules;