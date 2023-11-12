import { Permission } from "src/entity/permission.entity";

export class CreateRoleDto {
    roleId: number;
    role: string;
    description: string;
    parentIds: number[];
    permissions: Permission[];
}