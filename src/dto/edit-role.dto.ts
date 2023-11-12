import { Permission } from "src/entity/permission.entity";

export class EditRoleDto {
    roleId: number;
    role: string;
    description: string;
    parentIds: number[];
    permissions: Permission[];

}
