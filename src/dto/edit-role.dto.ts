import { File } from "src/entity/file.entity";
import { Permission } from "src/entity/permission.entity";

export class EditRoleDto {
    roleId: number;
    role: string;
    description: string;
    parentIds: number[];
    permissions: Permission[];
    files: File[];
}
