import { File } from "src/entity/file.entity";
import { Permission } from "src/entity/permission.entity";

export class CreateRoleDto {
    role: string;
    description: string;
    parentIds: number[];
    permissions: Permission[];
    files: File[];
}