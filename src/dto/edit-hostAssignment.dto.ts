import { UserHost } from "src/entity/user_host.entity";

export class EditHostAssignmentDto {
    hostIds: number[];
    userHosts: UserHost[];
}