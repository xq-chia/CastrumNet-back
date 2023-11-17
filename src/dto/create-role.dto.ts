import { Permission } from "src/entity/permission.entity";

export class CreateRoleDto {
    role: string;
    description: string;
    parentIds: number[];
    permissions: Permission[];
}